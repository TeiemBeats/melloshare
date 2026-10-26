import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const $=id=>document.getElementById(id);
const cfg=window.MELOSHARE_CONFIG||{};
const ready=/^https:\/\/.+\.supabase\.co$/.test(cfg.supabaseUrl||'') && !!cfg.supabaseAnonKey;
const db=ready?createClient(cfg.supabaseUrl,cfg.supabaseAnonKey):null;
const message=(s,bad=false)=>{$('status').textContent=s;$('status').style.color=bad?'#ffabab':'#b8f5d1'};
let role='artist';
function tab(which){const signup=which==='signup';$('signupForm').hidden=!signup;$('loginForm').hidden=signup;$('signupTab').classList.toggle('active',signup);$('loginTab').classList.toggle('active',!signup);message('')}
$('signupTab').onclick=()=>tab('signup');$('loginTab').onclick=()=>tab('login');
document.querySelectorAll('[data-role]').forEach(b=>b.onclick=()=>{role=b.dataset.role;document.querySelectorAll('[data-role]').forEach(x=>x.classList.toggle('active',x===b))});
if(!ready){$('setup').hidden=false;$('signupForm').querySelector('[type=submit]').disabled=true;$('loginForm').querySelector('[type=submit]').disabled=true}
async function show(session){
 $('guest').hidden=!!session;$('dashboard').hidden=!session;
 if(!session)return;
 $('accountEmail').textContent=session.user.email||'';
 const {data,error}=await db.from('profiles').select('display_name,role').eq('id',session.user.id).single();
 if(error){message('Signed in, but the database profile is missing. Run schema.sql in Supabase.',true);return}
 $('greeting').textContent='Hello, '+data.display_name;
 $('accountRole').textContent=data.role;
 message('');
}
$('signupForm').onsubmit=async e=>{e.preventDefault();if(!db)return;message('Creating account…');
 const {data,error}=await db.auth.signUp({email:$('signupEmail').value.trim(),password:$('signupPassword').value,options:{data:{display_name:$('displayName').value.trim(),role},emailRedirectTo:new URL('auth.html',location.href).href}});
 if(error)return message(error.message,true);
 if(data.session)await show(data.session);else message('Check your email for a confirmation link, then log in.');
};
$('loginForm').onsubmit=async e=>{e.preventDefault();if(!db)return;message('Logging in…');
 const {data,error}=await db.auth.signInWithPassword({email:$('loginEmail').value.trim(),password:$('loginPassword').value});
 if(error)return message(error.message,true);await show(data.session);
};
$('reset').onclick=async()=>{if(!db)return;const email=$('loginEmail').value.trim();if(!email)return message('Enter your email first.',true);
 const {error}=await db.auth.resetPasswordForEmail(email,{redirectTo:new URL('auth.html',location.href).href});
 message(error?error.message:'If that account exists, a reset email will be sent.',!!error);
};
$('logout').onclick=async()=>{if(!db)return;const {error}=await db.auth.signOut();if(error)return message(error.message,true);await show(null);message('Logged out.')};
if(db){db.auth.getSession().then(({data,error})=>error?message(error.message,true):show(data.session));db.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_OUT')show(null);if(event==='PASSWORD_RECOVERY')message('Recovery link verified. Password update is not yet implemented; contact site support.')})}
