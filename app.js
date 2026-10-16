var $=function(s){return document.querySelector(s)},$$=function(s){return [].slice.call(document.querySelectorAll(s))};
var mode='in';
function go(id){$$('.scr').forEach(function(x){x.classList.remove('on')});$('#'+id).classList.add('on')}
function toast(m){var t=$('#toast');t.textContent=m;t.classList.add('on');setTimeout(function(){t.classList.remove('on')},2400)}
/* onboarding */
function seen(){try{return localStorage.getItem('dk_ob')==='1'}catch(e){return false}}
function doneOb(){try{localStorage.setItem('dk_ob','1')}catch(e){}setMode('up');go('login')}
var oi=0,osl=$$('.sl'),odots=$$('.dots i');
function oshow(n){oi=n;osl.forEach(function(x,k){x.classList.toggle('on',k===n)});odots.forEach(function(d,k){d.classList.toggle('on',k===n)});$('#next').textContent=n===2?'Get started':'Next'}
$('#next').onclick=function(){oi<2?oshow(oi+1):doneOb()};$('#skip').onclick=doneOb;
function setMode(m){mode=m;$('#e1').textContent='';var up=m==='up';
 $('#lt').textContent=up?'Create account':'Sign in';$('#ls').textContent=up?'Join DealKaro and start earning.':'Welcome back. Log in to see your wallet.';
 $('#send').textContent=up?'Sign up':'Sign in';$('#tog').textContent=up?'Already have an account? Sign in':'New here? Create an account';
 $('#forgot').style.display=up?'none':'';$('#sn').style.display=up?'':'none';$('#t-in').classList.toggle('on',!up);$('#t-up').classList.toggle('on',up)}
$('#tog').onclick=function(){setMode(mode==='in'?'up':'in')};$('#t-in').onclick=function(){setMode('in')};$('#t-up').onclick=function(){setMode('up')};
$('#send').onclick=$('#forgot').onclick=function(){toast('Connecting... please try again in a moment')};
setTimeout(function(){if($('#splash').classList.contains('on'))go(seen()?'login':'ob')},3500);
setTimeout(function(){if(!window.__booted){$('#e1').textContent='Cannot connect to server. Check your internet.'}},9000);
function boot(){
window.__booted=true;dbg('boot');
firebase.initializeApp({apiKey:"AIzaSyC3-7L3juowr1J93ATjp3V_N1xpiAbJRpY",authDomain:"deal-karo-43401.firebaseapp.com",projectId:"deal-karo-43401",messagingSenderId:"758648309058",appId:"1:758648309058:web:7495ac162a86ff1ac974db"});
var auth=firebase.auth(),db=firebase.firestore();
var $=function(s){return document.querySelector(s)},$$=function(s){return [].slice.call(document.querySelectorAll(s))};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function go(id){$$('.scr').forEach(function(s){s.classList.remove('on')});$('#'+id).classList.add('on')}
function toast(m){var t=$('#toast');t.textContent=m;t.classList.add('on');setTimeout(function(){t.classList.remove('on')},2400)}
function today(){return new Date().toISOString().slice(0,10)}
var bal=0;function setBal(v){bal=v;var r=(v/100).toFixed(2);$('#bal').textContent=r;$('#bal2').textContent=r}
/* auth */
var curUser,splashDone=false,uref=null,ads=0;
function route(){if(!splashDone||curUser===undefined)return;var h=$('#home').classList.contains('on');
 if(curUser){if(!h)enter(curUser)}else if(h)go('login');else if($('#splash').classList.contains('on'))go(seen()?'login':'ob')}
setTimeout(function(){splashDone=true;route()},3000);
auth.onAuthStateChanged(function(u){dbg('auth');curUser=u||null;route()});
setTimeout(function(){if(curUser===undefined){dbg('auth-timeout');curUser=null;route()}},4000);
function msg(c){if(/invalid-credential|user-not-found|wrong-password/.test(c))return 'Wrong email or password.';
 if(c==='auth/email-already-in-use')return 'This email already has an account. Sign in instead.';if(c==='auth/weak-password')return 'Password must be at least 6 characters.';
 if(c==='auth/invalid-email')return 'Enter a valid email address.';if(c==='auth/network-request-failed')return 'No internet connection.';return 'Something went wrong. Try again.'}
var mailOk=function(e){return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)};
$('#send').onclick=function(){var e=$('#em').value.trim(),p=$('#pw').value,b=$('#send');window.__nm=$('#sn').value.trim().slice(0,40);
 if(!mailOk(e)){$('#e1').textContent='Enter a valid email address.';return}if(p.length<6){$('#e1').textContent='Password must be at least 6 characters.';return}
 $('#e1').textContent='';b.disabled=true;
 (mode==='in'?auth.signInWithEmailAndPassword(e,p):auth.createUserWithEmailAndPassword(e,p)).catch(function(x){$('#e1').textContent=msg(x.code)}).then(function(){b.disabled=false})};
$('#forgot').onclick=function(){var e=$('#em').value.trim();if(!mailOk(e)){$('#e1').textContent='Enter your email above first.';return}
 auth.sendPasswordResetEmail(e).then(function(){toast('Reset link sent to '+e)}).catch(function(x){$('#e1').textContent=msg(x.code)})};
$('#out').onclick=function(){auth.signOut()};
/* data */
var deals=[["Women's Fashion","Style Bazaar","Flat 40% off on clothing","Up to 8%",""],["Electronics","Phone Point","Up to ₹2,000 off on phones","Up to 3%",""],["Grocery","Kirana Kart","₹150 off your first order","Up to 5%",""],["Footwear","Juta Ghar","Buy 1 get 1 on shoes","Up to 10%",""],["Beauty","Glow House","Skincare combos","Up to 12%",""]];
var cats=["Electronics","Grocery","Men's Fashion","Women's Fashion","Footwear","Beauty","Health","Baby","Home & Kitchen"],cur='All',q='',sort='pop',stats={clicks:0,orders:0,daily:[0,0,0,0,0,0,0]};
function pct(d){return parseFloat(d[3].replace(/[^0-9.]/g,''))||0}
function render(){
 var cs=['All'].concat(deals.map(function(d){return d[0]}).filter(function(x,k,a){return a.indexOf(x)===k}));
 $('#chips').innerHTML=cs.map(function(c){return '<button class="chip'+(c===cur?' on':'')+'" data-c="'+esc(c)+'">'+esc(c)+'</button>'}).join('');
 var v=deals.map(function(d,k){return [d,k]}).filter(function(x){var d=x[0];return(cur==='All'||d[0]===cur)&&(d[1]+' '+d[2]).toLowerCase().indexOf(q)>-1});
 $('#list').innerHTML=v.length?v.map(function(x){var d=x[0];return '<button class="cd" data-k="'+x[1]+'"><div class="lo">'+esc(d[1].charAt(0))+'</div><b>'+esc(d[1])+'</b><span>'+esc(d[2])+'</span><em>'+esc(d[3])+'</em></button>'}).join(''):'<p class="mt" style="grid-column:1/3">No deals found.</p>';
 var p=deals.map(function(d,k){return [d,k]});
 if(sort==='az')p.sort(function(a,b){return a[0][1].localeCompare(b[0][1])});if(sort==='pc')p.sort(function(a,b){return pct(b[0])-pct(a[0])});
 $('#sorts').innerHTML=[['pop','Popular'],['az','A-Z'],['pc','Highest %']].map(function(s){return '<button class="chip'+(s[0]===sort?' on':'')+'" data-s="'+s[0]+'">'+s[1]+'</button>'}).join('');
 $('#plist').innerHTML=p.map(function(x){var d=x[0];return '<button class="row" data-k="'+x[1]+'"><div class="lo">'+esc(d[1].charAt(0))+'</div><div><b>'+esc(d[1])+'</b><span>'+esc(d[3])+' earnings</span></div><i>›</i></button>'}).join('');
 $('#st').innerHTML=[['Clicks',stats.clicks||0],['Orders',stats.orders||0],['Earnings','₹'+(bal/100).toFixed(2)],['Conv. rate',stats.clicks?Math.round((stats.orders||0)/stats.clicks*100)+'%':'0%']].map(function(s){return '<div><small>'+s[0]+'</small><b>'+esc(s[1])+'</b></div>'}).join('');
 var dl=stats.daily||[0,0,0,0,0,0,0],mx=Math.max.apply(null,dl.concat([1]));
 $('#chart').innerHTML='<svg viewBox="0 0 280 110" width="100%">'+dl.map(function(n,k){var h=Math.max(3,n/mx*80);return '<rect x="'+(k*40+8)+'" y="'+(90-h)+'" width="24" height="'+h+'" rx="5" fill="#FF2D87"/>'}).join('')+'<line x1="0" y1="92" x2="280" y2="92" stroke="#F1DFA0"/></svg>'}
function open1(k){var d=deals[k];if(d[4]&&curUser)window.open(d[4].replace('{uid}',curUser.uid),'_blank');else toast(d[1]+' link coming soon')}
$('#list').onclick=$('#plist').onclick=function(e){var b=e.target.closest('[data-k]');if(b)open1(b.getAttribute('data-k'))};
$('#chips').onclick=function(e){var c=e.target.getAttribute('data-c');if(c){cur=c;render()}};
$('#sorts').onclick=function(e){var s=e.target.getAttribute('data-s');if(s){sort=s;render()}};
$('#q').oninput=function(){q=this.value.trim().toLowerCase();render()};
$('#mk').onclick=function(){var v=$('#lk').value.trim();if(!/^https?:\/\/.+\..+/.test(v)){toast('Paste a valid link starting with https://');return}toast('Link maker turns on after affiliate approval')};
function page(p){$$('.pg').forEach(function(x){x.classList.toggle('on',x.id==='p-'+p)});$$('.nav button').forEach(function(x){x.classList.toggle('on',x.getAttribute('data-p')===p)});$('.body').scrollTop=0}
$('#nav').onclick=function(e){var b=e.target.closest('button');if(b)page(b.getAttribute('data-p'))};
/* drawer + sheet */
function drawer(on){$('#dr').classList.toggle('on',on);$('#ov').classList.toggle('on',on)}
$('#dr').innerHTML='<h3>Categories</h3><button data-c="All">All deals</button>'+cats.map(function(c){return '<button data-c="'+esc(c)+'">'+esc(c)+'</button>'}).join('');
$('#mn').onclick=function(){drawer(true)};
$('#dr').onclick=function(e){var c=e.target.getAttribute('data-c');if(c){cur=c;render();page('home');drawer(false)}};
function sheet(h){$('#sh').innerHTML=h;$('#sh').classList.add('on');$('#ov').classList.add('on')}
$('#ov').onclick=function(){drawer(false);$('#sh').classList.remove('on')};
function closeSheet(){$('#sh').classList.remove('on');$('#ov').classList.remove('on')}
$('#rp').onclick=function(){sheet('<h3>Request Payment</h3><p>Balance: ₹'+(bal/100).toFixed(2)+'. Minimum withdrawal ₹10.</p><input class="in" id="upi" value="'+esc(me.upi||'')+'" placeholder="Your UPI ID" aria-label="UPI ID"><input class="in" id="amt" type="number" inputmode="decimal" placeholder="Amount (₹)" aria-label="Amount"><button class="btn" id="go">Send request</button>');
 $('#go').onclick=function(){var u=$('#upi').value.trim(),a=parseFloat($('#amt').value);
  if(!/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(u)){toast('Enter a valid UPI ID');return}if(!(a>=10)){toast('Minimum withdrawal is ₹10');return}if(a*100>bal){toast('Amount is more than your balance');return}
  db.collection('withdrawals').add({uid:curUser.uid,upi:u,amount:Math.round(a*100),status:'pending',createdAt:firebase.firestore.FieldValue.serverTimestamp()}).then(function(){closeSheet();toast('Request sent. We will verify and pay you.')}).catch(function(){toast('Could not send. Try again.')})}};
$('#ph').onclick=function(){sheet('<h3>Payment History</h3><p class="mt">Loading…</p>');
 db.collection('withdrawals').where('uid','==',curUser.uid).get().then(function(q){var r=q.docs.map(function(d){return d.data()}).sort(function(a,b){return (b.createdAt?b.createdAt.seconds:0)-(a.createdAt?a.createdAt.seconds:0)});
  $('#sh').innerHTML='<h3>Payment History</h3>'+(r.length?r.map(function(x){return '<div class="row"><div><b>₹'+(x.amount/100).toFixed(2)+'</b><small>'+esc(x.upi)+'</small></div><span>'+esc(x.status)+'</span></div>'}).join(''):'<p class="mt">No requests yet.</p>')}).catch(function(){$('#sh').innerHTML='<h3>Payment History</h3><p class="mt">Could not load.</p>'})};
var SUPPORT_EMAIL="travikaagems@gmail.com",me={};
function info(t,h){sheet('<h3>'+t+'</h3>'+h)}
$('#rf').onclick=function(){var c=curUser.uid.slice(0,7).toUpperCase(),t='Join me on DealKaro and earn on every deal. My code: '+c;
 sheet('<h3>Refer &amp; Earn</h3><div class="row"><div><b>'+c+'</b><small>Your code</small></div></div><button class="btn" id="cp">Copy code</button><button class="btn" id="wa">Share on WhatsApp</button><p class="mt">Referral bonus is launching soon. When it is live, the bonus will be added after your friend makes a first confirmed purchase. Amounts and rules may change.</p>');
 $('#cp').onclick=function(){if(navigator.clipboard)navigator.clipboard.writeText(c).then(function(){toast('Code copied')},function(){toast('Code: '+c)});else toast('Code: '+c)};
 $('#wa').onclick=function(){window.open('https://wa.me/?text='+encodeURIComponent(t),'_blank')}};
$('#ep').onclick=function(){sheet('<h3>Edit Profile</h3><input class="in" id="enm" value="'+esc(me.name||'')+'" placeholder="Your name" aria-label="Name"><input class="in" id="eup" value="'+esc(me.upi||'')+'" placeholder="UPI ID for payouts" aria-label="UPI ID"><button class="btn" id="sv">Save</button>');
 $('#sv').onclick=function(){var n=$('#enm').value.trim().slice(0,40),u=$('#eup').value.trim();if(u&&!/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(u)){toast('Enter a valid UPI ID');return}
  uref.update({name:n,upi:u}).then(function(){me.name=n;me.upi=u;$('#nm').textContent=n||(curUser.email||'').split('@')[0];closeSheet();toast('Saved')}).catch(function(){toast('Could not save. Try again.')})}};
$('#me2').onclick=function(){sheet('<h3>My Earnings</h3><p class="mt">Loading…</p>');
 db.collection('earnings').where('uid','==',curUser.uid).get().then(function(q){var r=q.docs.map(function(d){return d.data()}).sort(function(a,b){return (b.createdAt?b.createdAt.seconds:0)-(a.createdAt?a.createdAt.seconds:0)});
  $('#sh').innerHTML='<h3>My Earnings</h3>'+(r.length?r.map(function(x){return '<div class="row"><div><b>'+esc(x.store||'Order')+'</b><small>'+(x.createdAt?new Date(x.createdAt.seconds*1000).toLocaleDateString():'')+'</small></div><span>₹'+((x.amount||0)/100).toFixed(2)+' · '+esc(x.status||'pending')+'</span></div>'}).join(''):'<p class="mt">No earnings yet. Your pending and confirmed cashback will show here.</p>')}).catch(function(){$('#sh').innerHTML='<h3>My Earnings</h3><p class="mt">Could not load.</p>'})};
$('#pv').onclick=function(){info('Privacy Policy','<p><b>What we collect:</b> your email, your name and UPI ID if you add them, your earnings and payment requests, and which store links you open.</p><p><b>Why:</b> to log you in, show your earnings and process payouts.</p><p><b>Third parties:</b> Google Firebase stores your account data. Google AdMob shows ads and may use your device advertising ID. Affiliate networks and stores receive your click when you open a store link.</p><p>We do not sell your personal data. To delete your account or data, email '+SUPPORT_EMAIL+'. DealKaro is for users aged 18 and above. We may update this policy and will show the latest version here.</p>')};
$('#tc').onclick=function(){info('Terms &amp; Conditions','<p>1. Cashback is added as <b>pending</b> after your purchase and becomes <b>available</b> only after the store confirms it. Returned or cancelled orders are not paid.</p><p>2. Minimum withdrawal is ₹10. Payouts are made to the UPI ID you give, after we verify the request.</p><p>3. Fake clicks, self-orders or any misuse can lead to cancelled earnings and a banned account.</p><p>4. Offers and rates come from our partners and can change anytime. DealKaro is not owned by or affiliated with the stores listed.</p><p>5. We may change these terms. Continued use means you accept them.</p>')};
$('#ct').onclick=function(){info('Contact Us','<p>Questions about payments or your account? Write to <b>'+SUPPORT_EMAIL+'</b>.</p><a class="btn" style="text-align:center;text-decoration:none;display:block" href="mailto:'+SUPPORT_EMAIL+'">Email support</a>')};
/* wallet */
function enter(u){go('home');page('home');setBal(0);startAds();
 $('#nm').textContent=(u.email||'').split('@')[0];$('#av').textContent=(u.email||'D').charAt(0).toUpperCase();$('#uid').textContent=u.uid.slice(0,7).toUpperCase();
 uref=db.collection('users').doc(u.uid);
 uref.get().then(function(s){if(s.exists)return s.data();var d={email:u.email,balance:0,name:window.__nm||''};return uref.set(d).then(function(){return d})}).then(function(d){
  me=d;if(d.name)$('#nm').textContent=d.name;$('#pend').textContent=((d.pending||0)/100).toFixed(2);setBal(d.balance||0);if(d.stats)stats=d.stats;render()}).catch(function(){toast('Could not load wallet')});
 db.collection('deals').orderBy('order').get().then(function(q){if(q.empty)return;deals=q.docs.map(function(x){var d=x.data();return [d.category||'Other',d.store||'',d.title||'',d.cashback||'',d.link||'']});cur='All';render()}).catch(function(){})}
/* banner ad (installed app only; test ids for now) */
var ADMOB_BANNER="ca-app-pub-3940256099942544/6300978111",adOn=false;
function startAds(){var C=window.Capacitor;if(adOn||!C||!C.isNativePlatform||!C.isNativePlatform())return;var A=C.Plugins&&C.Plugins.AdMob;if(!A)return;adOn=true;$('#app').classList.add('nat');
 A.initialize({initializeForTesting:true}).then(function(){return A.showBanner({adId:ADMOB_BANNER,adSize:'ADAPTIVE_BANNER',position:'BOTTOM_CENTER',margin:64,isTesting:true})}).catch(function(){adOn=false})}
render();
setInterval(function(){var b=$('#bn');if(b&&$('#p-home').classList.contains('on')){var w=b.clientWidth+10;b.scrollTo({left:b.scrollLeft+w>=b.scrollWidth-5?0:b.scrollLeft+w,behavior:'smooth'})}},3500);
}
var B=[function(n){return './firebase-'+n+'-compat.js'},function(n){return 'https://cdnjs.cloudflare.com/ajax/libs/firebase/10.12.2/firebase-'+n+'-compat.min.js'},function(n){return 'https://www.gstatic.com/firebasejs/10.12.2/firebase-'+n+'-compat.js'}],L=['app','auth','firestore'];
function dbg(m){var e=document.getElementById('dbg');if(e)e.textContent+=m+' '}
dbg('js');
function ld(s,ok,bad){var t=document.createElement('script'),d=false,to=setTimeout(function(){if(!d){d=true;dbg('timeout');bad()}},7000);t.onload=function(){if(d)return;d=true;clearTimeout(to);dbg('+'+s.split('/').pop().replace('-compat.min.js','').replace('-compat.js','').replace('firebase-',''));ok()};t.onerror=function(){if(d)return;d=true;clearTimeout(to);dbg('x'+s.split('/').pop().slice(0,12));bad()};t.src=s;document.head.appendChild(t)}
function tryBase(b){var k=0;(function next(){if(k>=L.length){try{boot()}catch(e){document.querySelector('#splash p').textContent='Error: '+e.message}return}ld(B[b](L[k]),function(){k++;next()},function(){if(b+1<B.length)tryBase(b+1);else document.querySelector('#splash p').textContent='Could not load. Check your internet and reopen.'})})()}
function sp(t){var p=document.querySelector('#splash p');if(p&&!window.__booted)p.textContent=t}
window.addEventListener('error',function(e){sp('Error: '+(e.message||'script failed'))});
setTimeout(function(){sp('Still loading… check your internet')},9000);
tryBase(0);
  
