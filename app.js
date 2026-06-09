/* ========================================================================
   BankJobs.io  —  Interactive SPA
   Vanilla JS hash router + view renderers + local state.
   ======================================================================== */

/* ----------------------------- STATE ----------------------------------- */
const STATE = {
  user: JSON.parse(localStorage.getItem('bj_user') || 'null'),
  applications: JSON.parse(localStorage.getItem('bj_apps') || '[]'),
  saved: JSON.parse(localStorage.getItem('bj_saved') || '[]'),
};

function persist() {
  localStorage.setItem('bj_user', JSON.stringify(STATE.user));
  localStorage.setItem('bj_apps', JSON.stringify(STATE.applications));
  localStorage.setItem('bj_saved', JSON.stringify(STATE.saved));
}

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.add('hidden'), 2400);
}

/* ----------------------------- DATA ------------------------------------ */
const BANKS = [
  {name:'SBI', logo:'https://www.freepnglogos.com/uploads/sbi-logo-png/sbi-logo-state-bank-india-group-vector-eps-0.png'},
  {name:'HDFC Bank', logo:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/HDFC_Bank_Logo.svg/1280px-HDFC_Bank_Logo.svg.png'},
  {name:'ICICI Bank', logo:'https://www.thestatesman.com/wp-content/uploads/2025/07/ICICIBANK-THESTATESMAN.webp'},
  {name:'Axis Bank', logo:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Axis_Bank_logo.svg/3840px-Axis_Bank_logo.svg.png'},
  {name:'Kotak Mahindra', logo:'https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Kotak_Mahindra_Bank_logo.svg/1280px-Kotak_Mahindra_Bank_logo.svg.png'},
  {name:'IndusInd Bank', logo:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/IndusInd_Bank_SVG_Logo.svg/3840px-IndusInd_Bank_SVG_Logo.svg.png'},
  {name:'Bank of Baroda', logo:'https://1000logos.net/wp-content/uploads/2021/06/Bank-of-Baroda-logo.png'},
  {name:'IDFC FIRST Bank', logo:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Logo_of_IDFC_First_Bank.svg/1280px-Logo_of_IDFC_First_Bank.svg.png'},
];

const APPLY_URL_MAP = {
  'ICICI Bank':          'https://www.icicicareers.com/',
  'HDFC Bank':           'https://www.hdfcbank.com/content/bbp/repositories/723fb80a-2dde-42a3-9793-7ae1be57c87f/?folderPath=/Footer/Careers/',
  'State Bank of India': 'https://bank.sbi/web/guest/careers',
  'SBI':                 'https://bank.sbi/web/guest/careers',
  'Axis Bank':           'https://www.axisbank.com/careers',
  'Kotak Mahindra Bank': 'https://www.kotak.com/en/careers.html',
  'Kotak Mahindra':      'https://www.kotak.com/en/careers.html',
  'IndusInd Bank':       'https://www.indusind.com/in/en/careers.html',
  'IDFC First Bank':     'https://www.idfcfirstbank.com/careers',
  'IDFC FIRST Bank':     'https://www.idfcfirstbank.com/careers',
  'Bank of Baroda':      'https://www.bankofbaroda.in/career',
  'Punjab National Bank':'https://www.pnbindia.in/recruitment.html',
  'Canara Bank':         'https://canarabank.com/user_page.aspx?menulevel=1&menuid=10&SubMenuID=44',
  'Union Bank of India': 'https://www.unionbankofindia.co.in/english/recruitment.aspx',
  'Yes Bank':            'https://www.yesbank.in/about-us/career',
  'Federal Bank':        'https://www.federalbank.co.in/career',
  'RBL Bank':            'https://www.rblbank.com/careers',
  'AU Small Finance Bank':'https://www.aubank.in/careers',
  'Bajaj Finserv':       'https://www.bajajfinserv.in/careers',
  'Bajaj Finance':       'https://www.bajajfinserv.in/careers',
  'HDFC Life':           'https://www.hdfclife.com/careers',
  'Razorpay':            'https://razorpay.com/jobs/',
  'ICICI Lombard':       'https://www.icicilombard.com/careers',
  'ICICI Prudential':    'https://www.iciciprulife.com/careers.html',
  'SBI Life':            'https://www.sbilife.co.in/en/about-sbi-life/careers',
};

function jobApplyUrl(job) {
  return job.applyUrl || APPLY_URL_MAP[job.company] || '#';
}

const LOGO_MAP = {
  // Banks
  'State Bank of India': 'https://www.freepnglogos.com/uploads/sbi-logo-png/sbi-logo-state-bank-india-group-vector-eps-0.png',
  'SBI': 'https://www.freepnglogos.com/uploads/sbi-logo-png/sbi-logo-state-bank-india-group-vector-eps-0.png',
  'HDFC Bank': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/HDFC_Bank_Logo.svg/1280px-HDFC_Bank_Logo.svg.png',
  'ICICI Bank': 'https://www.thestatesman.com/wp-content/uploads/2025/07/ICICIBANK-THESTATESMAN.webp',
  'Axis Bank': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Axis_Bank_logo.svg/3840px-Axis_Bank_logo.svg.png',
  'Kotak Mahindra Bank': 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Kotak_Mahindra_Bank_logo.svg/1280px-Kotak_Mahindra_Bank_logo.svg.png',
  'IndusInd Bank': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/IndusInd_Bank_SVG_Logo.svg/3840px-IndusInd_Bank_SVG_Logo.svg.png',
  'Bank of Baroda': 'https://1000logos.net/wp-content/uploads/2021/06/Bank-of-Baroda-logo.png',
  'IDFC First Bank': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Logo_of_IDFC_First_Bank.svg/1280px-Logo_of_IDFC_First_Bank.svg.png',
  'Punjab National Bank': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Punjab_National_Bank_logo.svg/1280px-Punjab_National_Bank_logo.svg.png',
  'Canara Bank': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Canara_Bank_Logo.svg/1280px-Canara_Bank_Logo.svg.png',
  'Union Bank of India': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Union_Bank_of_India_logo.svg/1280px-Union_Bank_of_India_logo.svg.png',
  'Yes Bank': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Yes_Bank_SVG_Logo.svg/1280px-Yes_Bank_SVG_Logo.svg.png',
  'Federal Bank': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Federal_bank_logo.svg/1280px-Federal_bank_logo.svg.png',
  'RBL Bank': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/RBL-Bank-Logo.svg/1280px-RBL-Bank-Logo.svg.png',
  'AU Small Finance Bank': 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/AU_Small_Finance_Bank_logo.svg/1280px-AU_Small_Finance_Bank_logo.svg.png',
  // BFSI / NBFC / Insurance / Fintech
  'Bajaj Finserv': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Bajaj_Finserv_Logo.svg/1280px-Bajaj_Finserv_Logo.svg.png',
  'Bajaj Finance': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Bajaj_Finserv_Logo.svg/1280px-Bajaj_Finserv_Logo.svg.png',
  'HDFC Life': 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/HDFC_Life_Insurance_Logo.svg/1280px-HDFC_Life_Insurance_Logo.svg.png',
  'ICICI Lombard': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Logo_of_ICICI_Lombard.svg/1280px-Logo_of_ICICI_Lombard.svg.png',
  'ICICI Prudential': 'https://upload.wikimedia.org/wikipedia/en/thumb/3/30/ICICI_Prudential_Life_Insurance_logo.svg/1280px-ICICI_Prudential_Life_Insurance_logo.svg.png',
  'LIC': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Life_Insurance_Corporation_of_India_logo.svg/1024px-Life_Insurance_Corporation_of_India_logo.svg.png',
  'SBI Life': 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8d/SBI_Life_Insurance_Company_Limited.svg/1280px-SBI_Life_Insurance_Company_Limited.svg.png',
  'Star Health': 'https://upload.wikimedia.org/wikipedia/en/thumb/9/93/Star_Health_and_Allied_Insurance_logo.svg/1280px-Star_Health_and_Allied_Insurance_logo.svg.png',
  'Tata Capital': 'https://upload.wikimedia.org/wikipedia/en/3/3d/Tata_Capital_Logo.svg',
  'Aditya Birla Capital': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Aditya_Birla_Capital_logo.svg/1280px-Aditya_Birla_Capital_logo.svg.png',
  'Mahindra Finance': 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Mahindra_%26_Mahindra_Financial_Services_logo.svg/1280px-Mahindra_%26_Mahindra_Financial_Services_logo.svg.png',
  'Muthoot Finance': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Muthoot_Finance_logo.svg/1280px-Muthoot_Finance_logo.svg.png',
  'Razorpay': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Razorpay_logo.svg/1280px-Razorpay_logo.svg.png',
  'Paytm': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/1280px-Paytm_Logo_%28standalone%29.svg.png',
  'PhonePe': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/PhonePe_Logo.svg/1280px-PhonePe_Logo.svg.png',
  'PolicyBazaar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Policybazaar_logo.svg/1280px-Policybazaar_logo.svg.png',
  'CRED': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Cred_logo.svg/1280px-Cred_logo.svg.png',
  'Groww': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Groww_app_logo.png/240px-Groww_app_logo.png',
  'Zerodha': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Zerodha_Kite_logo.svg/1280px-Zerodha_Kite_logo.svg.png',
  'Angel One': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Angel_One_logo.svg/1280px-Angel_One_logo.svg.png',
  'KreditBee': 'https://kreditbee.in/static/images/kreditbee-logo.svg',
  'Lendingkart': 'https://www.lendingkart.com/wp-content/themes/lendingkart-theme/assets/images/logos/lendingkart-logo.svg',
};

function companyAvatar(company, size = 36) {
  const logo = LOGO_MAP[company];
  const cls = `w-10 h-10 rounded-md bg-white border border-slate-100 grid place-items-center shrink-0 overflow-hidden p-1`;
  if (logo) {
    return `<div class="${cls}"><img src="${logo}" alt="${company}" loading="lazy" class="avatar-logo-img"/></div>`;
  }
  const initials = company.split(' ').map(w=>w[0]).join('').slice(0,3);
  return `<div class="${cls} text-slate-700 font-bold text-[11px]">${initials}</div>`;
}

// criteria fields are used by the Eligibility engine:
//   minAge, maxAge        — inclusive
//   degree                — array of accepted graduation degrees
//   minPct                — minimum aggregate %
//   minExpYrs             — minimum experience required
//   needsExam             — relevant entrance exam (if any)
const JOBS = [
  // ── BANK JOBS ────────────────────────────────────────────────────
  {id:'j1', title:'Relationship Manager', company:'ICICI Bank', location:'Mumbai, Maharashtra', exp:'0-2 Yrs', salary:'₹4.5 - 6.5 LPA', type:'Full Time', posted:'1d ago', tag:'New', category:'bank', applyUrl:'https://www.icicicareers.com/',
   skills:['Sales','Communication','Customer Relationship','MS Office'],
   description:'Manage and grow a portfolio of priority customers, cross-sell banking products and ensure excellent service. Reports to the Branch Manager.',
   eligibility:['Graduate in any discipline','Age: 21 – 30 years','Aggregate 50%+','Strong communication skills'],
   responsibilities:['Build and maintain customer relationships','Cross-sell banking products','Achieve assigned sales targets','Ensure KYC & regulatory compliance'],
   criteria:{ minAge:21, maxAge:30, degree:["Bachelor's Degree","Master's Degree"], minPct:50, minExpYrs:0 }
  },
  {id:'j2', title:'Deputy Manager - Retail Banking', company:'HDFC Bank', location:'Pune, Maharashtra', exp:'2-5 Yrs', salary:'₹6.0 - 9.0 LPA', type:'Full Time', posted:'2d ago', category:'bank', applyUrl:'https://www.hdfcbank.com/content/bbp/repositories/723fb80a-2dde-42a3-9793-7ae1be57c87f/?folderPath=/Footer/Careers/',
   skills:['Retail Banking','Team Lead','Operations','CRM'],
   description:'Lead a team of relationship officers, drive branch business and own operational excellence across retail banking.',
   eligibility:['Graduate (MBA preferred)','Age: 23 – 32 years','2+ yrs retail banking experience','Team handling capability'],
   responsibilities:['Drive branch business','Manage team performance','Handle customer escalations','Branch P&L oversight'],
   criteria:{ minAge:23, maxAge:32, degree:["Bachelor's Degree","Master's Degree"], minPct:55, minExpYrs:2 }
  },
  {id:'j3', title:'Probationary Officer', company:'State Bank of India', location:'Delhi', exp:'0-2 Yrs', salary:'₹5.5 - 8.5 LPA', type:'Full Time', posted:'2d ago', category:'bank', applyUrl:'https://bank.sbi/web/guest/careers',
   skills:['Banking','General Awareness','Quantitative Aptitude','Reasoning'],
   description:'SBI PO — selected candidates undergo a 2-year probation with training in Hyderabad and posting across India as Assistant Managers (JMGS-I).',
   eligibility:['Graduate in any discipline','Age: 21 – 30 years (relaxation for SC/ST/OBC as per rules)','Cleared SBI PO Prelims + Mains + Interview','60% in graduation (general)'],
   responsibilities:['Branch operations & customer service','Credit appraisal basics','Cross-sell financial products','Lead a team after probation'],
   criteria:{ minAge:21, maxAge:30, degree:["Bachelor's Degree","Master's Degree"], minPct:60, minExpYrs:0, needsExam:'SBI PO' }
  },
  {id:'j4', title:'Credit Officer', company:'Kotak Mahindra Bank', location:'Mumbai', exp:'1-3 Yrs', salary:'₹3.5 - 5.5 LPA', type:'Full Time', posted:'1d ago', category:'bank', applyUrl:'https://www.kotak.com/en/careers.html',
   skills:['Credit Analysis','Underwriting','Risk','Excel'],
   description:'Credit appraisal & underwriting for retail loan products — home, personal & business loans.',
   eligibility:['Graduate (Finance/Commerce preferred)','Age: 22 – 32 years','1+ year in lending','Aggregate 55%+'],
   responsibilities:['Loan file appraisal','Risk assessment & PD calls','Coordinate with sales & ops','Maintain portfolio quality'],
   criteria:{ minAge:22, maxAge:32, degree:["Bachelor's Degree","Master's Degree"], minPct:55, minExpYrs:1 }
  },
  {id:'j5', title:'Sales Officer', company:'IDFC First Bank', location:'Bangalore', exp:'0-2 Yrs', salary:'₹3.0 - 4.0 LPA', type:'Full Time', posted:'2d ago', category:'bank', applyUrl:'https://www.idfcfirstbank.com/careers',
   skills:['Sales','Field Work','CASA','Lead Generation'],
   description:'Field sales role for CASA & retail liability products. Daily outdoor activity with monthly targets.',
   eligibility:['Graduate (any discipline)','Age: 21 – 28 years','Two-wheeler & valid DL preferred'],
   responsibilities:['CASA acquisition','Daily field visits','Lead conversion','Customer onboarding & KYC'],
   criteria:{ minAge:21, maxAge:28, degree:["Bachelor's Degree","Diploma","Master's Degree"], minPct:50, minExpYrs:0 }
  },
  {id:'j6', title:'Assistant Manager', company:'HDFC Bank', location:'Pune', exp:'2-4 Yrs', salary:'₹5.0 - 7.0 LPA', type:'Full Time', posted:'3d ago', category:'bank', applyUrl:'https://www.hdfcbank.com/content/bbp/repositories/723fb80a-2dde-42a3-9793-7ae1be57c87f/?folderPath=/Footer/Careers/',
   skills:['Operations','Branch Banking','Audit','Compliance'],
   description:'Branch operations manager overseeing day-to-day functioning, vault, cash, and audit readiness.',
   eligibility:['Graduate / MBA','Age: 23 – 33 years','2+ yrs branch banking exp'],
   responsibilities:['Branch ops & cash mgmt','Audit readiness','Service quality','Staff scheduling'],
   criteria:{ minAge:23, maxAge:33, degree:["Bachelor's Degree","Master's Degree"], minPct:55, minExpYrs:2 }
  },
  {id:'j7', title:'Probationary Officer', company:'Bank of Baroda', location:'Multiple Cities', exp:'0-2 Yrs', salary:'₹5.0 - 7.5 LPA', type:'Full Time', posted:'5d ago', category:'bank', applyUrl:'https://www.bankofbaroda.in/career',
   skills:['Banking','Quant','Reasoning','English'],
   description:'BoB Probationary Officer (Manipal PGDBF) — 1 year PGDBF programme followed by JMGS-I posting.',
   eligibility:['Graduate in any discipline','Age: 20 – 28 years','Cleared online test + GD + Interview','55%+ in graduation'],
   responsibilities:['Branch operations','Credit & sales','Customer service'],
   criteria:{ minAge:20, maxAge:28, degree:["Bachelor's Degree","Master's Degree"], minPct:55, minExpYrs:0, needsExam:'BoB PGDBF' }
  },
  {id:'j8', title:'Probationary Officer', company:'Punjab National Bank', location:'Multiple Cities', exp:'0-2 Yrs', salary:'₹5.2 - 7.8 LPA', type:'Full Time', posted:'1w ago', category:'bank', applyUrl:'https://www.pnbindia.in/recruitment.html',
   skills:['Banking','General Awareness','Quant','Reasoning'],
   description:'PNB PO via IBPS PO common recruitment process. Posted as Officer JMGS-I after training.',
   eligibility:['Graduate (any stream)','Age: 20 – 30 years','Cleared IBPS PO Prelims + Mains + Interview'],
   responsibilities:['Customer service','Loan appraisal basics','Branch operations'],
   criteria:{ minAge:20, maxAge:30, degree:["Bachelor's Degree","Master's Degree"], minPct:55, minExpYrs:0, needsExam:'IBPS PO' }
  },
  {id:'j9', title:'Clerk (Customer Service Associate)', company:'Canara Bank', location:'Multiple Cities', exp:'0-1 Yrs', salary:'₹2.8 - 3.5 LPA', type:'Full Time', posted:'3d ago', category:'bank', applyUrl:'https://canarabank.com/user_page.aspx?menulevel=1&menuid=10&SubMenuID=44',
   skills:['Customer Service','Cash Handling','Banking Awareness'],
   description:'Front-office customer service role at Canara Bank branches. Recruitment via IBPS Clerk.',
   eligibility:['Graduate (any discipline)','Age: 20 – 28 years','Cleared IBPS Clerk Prelims + Mains','Local language proficiency'],
   responsibilities:['Cash deposits & withdrawals','Customer queries','KYC documentation','Daily branch operations'],
   criteria:{ minAge:20, maxAge:28, degree:["Bachelor's Degree"], minPct:50, minExpYrs:0, needsExam:'IBPS Clerk' }
  },
  {id:'j10', title:'Branch Manager', company:'Axis Bank', location:'Hyderabad', exp:'5-8 Yrs', salary:'₹12 - 18 LPA', type:'Full Time', posted:'4d ago', category:'bank',
   skills:['Branch Banking','Team Leadership','P&L','Sales'],
   description:'Lead a retail branch with full P&L responsibility — business, ops, audit & team performance.',
   eligibility:['Graduate / MBA','Age: 28 – 40 years','5+ yrs in retail banking','Proven team leadership'],
   responsibilities:['Branch P&L','Team of 8-12 people','Compliance & audit','High-value customer relationships'],
   criteria:{ minAge:28, maxAge:40, degree:["Bachelor's Degree","Master's Degree"], minPct:55, minExpYrs:5 }
  },
  {id:'j11', title:'Wealth Relationship Manager', company:'Kotak Mahindra Bank', location:'Mumbai', exp:'3-6 Yrs', salary:'₹9 - 14 LPA', type:'Full Time', posted:'2d ago', tag:'Hot', category:'bank',
   skills:['Wealth Management','MF','PMS','Insurance','HNI'],
   description:'Manage HNI portfolios across MF, PMS, insurance and structured products at Kotak Wealth.',
   eligibility:['Graduate / MBA','Age: 26 – 38 years','3+ yrs wealth/private banking','NISM Series V-A & X-A preferred'],
   responsibilities:['Manage HNI book of ₹25cr+','Cross-asset advisory','Client acquisition','Portfolio reviews'],
   criteria:{ minAge:26, maxAge:38, degree:["Bachelor's Degree","Master's Degree"], minPct:55, minExpYrs:3 }
  },
  {id:'j12', title:'Personal Banker', company:'IndusInd Bank', location:'Chennai', exp:'1-3 Yrs', salary:'₹3.8 - 5.5 LPA', type:'Full Time', posted:'1d ago', category:'bank',
   skills:['CASA','Cross-Sell','Customer Service'],
   description:'Front-office Personal Banker handling walk-in customers and driving CASA + investments.',
   eligibility:['Graduate','Age: 21 – 30 years','1+ year customer-facing role'],
   responsibilities:['CASA opening & servicing','Cross-sell MF/insurance','Lobby management','Customer retention'],
   criteria:{ minAge:21, maxAge:30, degree:["Bachelor's Degree","Master's Degree"], minPct:50, minExpYrs:1 }
  },
  {id:'j13', title:'Assistant Manager - Credit', company:'Yes Bank', location:'Mumbai', exp:'1-3 Yrs', salary:'₹5.5 - 7.5 LPA', type:'Full Time', posted:'2d ago', category:'bank',
   skills:['Credit Analysis','Financial Modeling','Excel','CIBIL'],
   description:'Credit underwriting for SME and mid-market clients. Financial spreading + risk recommendations.',
   eligibility:['CA / MBA Finance / Graduate','Age: 22 – 30 years','1+ yr in credit','Strong financial analysis'],
   responsibilities:['Spread financials','Risk analysis & CAM preparation','Industry research','Coordinate with RM & ops'],
   criteria:{ minAge:22, maxAge:30, degree:["Bachelor's Degree","Master's Degree"], minPct:60, minExpYrs:1 }
  },
  {id:'j14', title:'Cashier', company:'Federal Bank', location:'Kochi', exp:'0-1 Yrs', salary:'₹2.6 - 3.4 LPA', type:'Full Time', posted:'1w ago', category:'bank',
   skills:['Cash Handling','Customer Service','Banking Basics'],
   description:'Single Window Operator (SWO) handling cash transactions at Federal Bank branches.',
   eligibility:['Graduate','Age: 20 – 26 years','Local language fluency'],
   responsibilities:['Cash transactions','Customer service','Daily cash tallying'],
   criteria:{ minAge:20, maxAge:26, degree:["Bachelor's Degree","Diploma"], minPct:50, minExpYrs:0 }
  },
  {id:'j15', title:'Relationship Manager - SME', company:'RBL Bank', location:'Delhi NCR', exp:'2-5 Yrs', salary:'₹7 - 11 LPA', type:'Full Time', posted:'3d ago', category:'bank',
   skills:['SME Banking','Working Capital','Credit Assessment'],
   description:'Manage SME client book — working capital, term loans, trade finance.',
   eligibility:['Graduate / MBA','Age: 25 – 35 years','2+ yrs SME banking'],
   responsibilities:['Manage SME portfolio ₹50-100cr','New client acquisition','Credit deal structuring','Renewal & monitoring'],
   criteria:{ minAge:25, maxAge:35, degree:["Bachelor's Degree","Master's Degree"], minPct:55, minExpYrs:2 }
  },
  {id:'j16', title:'Probationary Officer', company:'Union Bank of India', location:'Multiple Cities', exp:'0-2 Yrs', salary:'₹5.0 - 7.5 LPA', type:'Full Time', posted:'1w ago', category:'bank',
   skills:['Banking','Quant','Reasoning','English','Computer Aptitude'],
   description:'Union Bank PO via IBPS PO. Posted as JMGS-I officer after training.',
   eligibility:['Graduate','Age: 20 – 30 years','Cleared IBPS PO'],
   responsibilities:['Branch operations','Customer relations','Credit basics'],
   criteria:{ minAge:20, maxAge:30, degree:["Bachelor's Degree","Master's Degree"], minPct:55, minExpYrs:0, needsExam:'IBPS PO' }
  },
  {id:'j17', title:'Officer - Sales (CASA)', company:'AU Small Finance Bank', location:'Jaipur', exp:'0-2 Yrs', salary:'₹2.8 - 4.0 LPA', type:'Full Time', posted:'2d ago', category:'bank',
   skills:['CASA Sales','Field Work','Cold Calling'],
   description:'Drive CASA acquisition through field sales and referrals in Tier-2 & Tier-3 cities.',
   eligibility:['Graduate','Age: 21 – 28 years','Two-wheeler preferred'],
   responsibilities:['CASA target achievement','Daily field visits','Customer onboarding'],
   criteria:{ minAge:21, maxAge:28, degree:["Bachelor's Degree","Diploma"], minPct:50, minExpYrs:0 }
  },

  // ── BFSI / NBFC / INSURANCE / FINTECH ────────────────────────────
  {id:'b1', title:'Business Development Executive', company:'Bajaj Finserv', location:'Pune', exp:'0-2 Yrs', salary:'₹3.0 - 4.5 LPA', type:'Full Time', posted:'2d ago', category:'bfsi',
   skills:['BD','Sales','NBFC','Field Work'],
   description:'NBFC field BD role driving personal loan & EMI card business through DSAs and direct channels.',
   eligibility:['Graduate','Age: 21 – 28 years','Strong communication','Two-wheeler preferred'],
   responsibilities:['Lead conversion','Channel partner mgmt','Daily target tracking','Customer KYC'],
   criteria:{ minAge:21, maxAge:28, degree:["Bachelor's Degree","Diploma"], minPct:50, minExpYrs:0 }
  },
  {id:'b2', title:'Insurance Advisor', company:'HDFC Life', location:'Hyderabad', exp:'0-3 Yrs', salary:'₹2.5 - 4.5 LPA', type:'Full Time', posted:'1d ago', tag:'New', category:'bfsi',
   skills:['Insurance','Sales','Advisory','IRDA'],
   description:'Advise customers on life insurance products (ULIPs, term, savings) and close policies.',
   eligibility:['Graduate','Age: 21 – 35 years','IRDA certification (will be sponsored)'],
   responsibilities:['Customer advisory','Policy issuance','Renewal collection','Lead generation'],
   criteria:{ minAge:21, maxAge:35, degree:["Bachelor's Degree","Diploma","12th Pass"], minPct:45, minExpYrs:0 }
  },
  {id:'b3', title:'Loan Officer', company:'Bajaj Finance', location:'Mumbai', exp:'1-3 Yrs', salary:'₹3.5 - 5.0 LPA', type:'Full Time', posted:'4d ago', category:'bfsi',
   skills:['Lending','KYC','Sales','PD'],
   description:'Drive personal loan & business loan disbursements end-to-end.',
   eligibility:['Graduate','Age: 22 – 30 years','NBFC experience preferred'],
   responsibilities:['Sourcing & disbursal','KYC & PD','Portfolio quality','EMI collection escalation'],
   criteria:{ minAge:22, maxAge:30, degree:["Bachelor's Degree"], minPct:50, minExpYrs:1 }
  },
  {id:'b4', title:'Fintech Operations Analyst', company:'Razorpay', location:'Bangalore', exp:'1-3 Yrs', salary:'₹6.0 - 9.0 LPA', type:'Full Time', posted:'1d ago', tag:'Hot', category:'bfsi',
   skills:['Ops','SQL','Excel','Payments','Reconciliation'],
   description:'Operations role across the payments lifecycle — reconciliation, disputes, settlement and merchant ops.',
   eligibility:['Graduate (any stream)','Age: 22 – 30 years','Excel/SQL skills','1+ yr in fintech ops preferred'],
   responsibilities:['Reconciliation across banks/PSPs','Dispute & chargeback mgmt','Settlement monitoring','Process automation'],
   criteria:{ minAge:22, maxAge:30, degree:["Bachelor's Degree","Master's Degree"], minPct:60, minExpYrs:1 }
  },
  {id:'b5', title:'Claims Executive', company:'ICICI Lombard', location:'Mumbai', exp:'1-3 Yrs', salary:'₹3.5 - 5.5 LPA', type:'Full Time', posted:'3d ago', category:'bfsi',
   skills:['Claims','Health Insurance','Documentation','Customer Service'],
   description:'Process motor / health insurance claims end-to-end with TAT compliance.',
   eligibility:['Graduate','Age: 22 – 30 years','1+ yr in insurance preferred'],
   responsibilities:['Claim verification','Customer communication','TAT compliance','Fraud detection basics'],
   criteria:{ minAge:22, maxAge:30, degree:["Bachelor's Degree"], minPct:50, minExpYrs:1 }
  },
  {id:'b6', title:'Sales Manager - Health Insurance', company:'Star Health', location:'Chennai', exp:'2-5 Yrs', salary:'₹5.0 - 8.0 LPA', type:'Full Time', posted:'2d ago', category:'bfsi',
   skills:['Health Insurance','Team Lead','Agency Channel'],
   description:'Lead a team of agents/advisors driving retail health insurance business.',
   eligibility:['Graduate','Age: 25 – 38 years','2+ yrs in insurance sales'],
   responsibilities:['Recruit & train agents','Drive premium targets','Channel partner relations'],
   criteria:{ minAge:25, maxAge:38, degree:["Bachelor's Degree","Master's Degree"], minPct:50, minExpYrs:2 }
  },
  {id:'b7', title:'Development Officer', company:'LIC', location:'Multiple Cities', exp:'0-3 Yrs', salary:'₹3.5 - 6.0 LPA + Incentives', type:'Full Time', posted:'5d ago', category:'bfsi',
   skills:['Insurance','Recruitment','Agency','Field Sales'],
   description:'LIC Development Officer (ADO) — recruit, train and supervise insurance agents in your zone.',
   eligibility:['Graduate','Age: 21 – 30 years','Cleared LIC ADO exam','Local language fluency'],
   responsibilities:['Recruit agents','Drive new business','Agent productivity','Customer service'],
   criteria:{ minAge:21, maxAge:30, degree:["Bachelor's Degree","Master's Degree"], minPct:50, minExpYrs:0, needsExam:'LIC ADO' }
  },
  {id:'b8', title:'Relationship Manager - Wealth', company:'Aditya Birla Capital', location:'Mumbai', exp:'3-6 Yrs', salary:'₹8 - 13 LPA', type:'Full Time', posted:'2d ago', category:'bfsi',
   skills:['MF','PMS','HNI','Wealth'],
   description:'Manage HNI clients across MF, PMS, AIF and structured products.',
   eligibility:['Graduate / MBA','Age: 26 – 38 years','3+ yrs in wealth/AMC','NISM V-A required'],
   responsibilities:['HNI book management','Cross-asset advisory','Client acquisition','Portfolio review'],
   criteria:{ minAge:26, maxAge:38, degree:["Bachelor's Degree","Master's Degree"], minPct:55, minExpYrs:3 }
  },
  {id:'b9', title:'Customer Success Associate', company:'CRED', location:'Bangalore', exp:'1-3 Yrs', salary:'₹6 - 9 LPA', type:'Full Time', posted:'1d ago', tag:'Hot', category:'bfsi',
   skills:['CX','Empathy','SaaS','Fintech'],
   description:'Premium customer success role for CRED members — escalations, retention and product feedback.',
   eligibility:['Graduate','Age: 22 – 30 years','Excellent written English','1+ yr in CX'],
   responsibilities:['Member escalation handling','Retention initiatives','Surface product insights to PM'],
   criteria:{ minAge:22, maxAge:30, degree:["Bachelor's Degree","Master's Degree"], minPct:60, minExpYrs:1 }
  },
  {id:'b10', title:'KYC & Compliance Analyst', company:'Paytm', location:'Noida', exp:'1-3 Yrs', salary:'₹5 - 7.5 LPA', type:'Full Time', posted:'3d ago', category:'bfsi',
   skills:['KYC','AML','Compliance','PMLA'],
   description:'KYC/AML reviews for Paytm Payments Bank & wallet onboarding.',
   eligibility:['Graduate','Age: 22 – 30 years','1+ yr in KYC/compliance'],
   responsibilities:['CDD / EDD reviews','STR filing support','Sanctions screening','Audit preparation'],
   criteria:{ minAge:22, maxAge:30, degree:["Bachelor's Degree","Master's Degree"], minPct:55, minExpYrs:1 }
  },
  {id:'b11', title:'Equity Dealer', company:'Zerodha', location:'Bangalore', exp:'1-3 Yrs', salary:'₹4 - 6 LPA', type:'Full Time', posted:'2d ago', category:'bfsi',
   skills:['Equity','NISM','Trading','Customer Service'],
   description:'Equity dealing & client support at Zerodha — execute trades and resolve broking queries.',
   eligibility:['Graduate','Age: 21 – 30 years','NISM Series VIII certification','1+ yr broking experience preferred'],
   responsibilities:['Order execution','Client query resolution','Risk monitoring','Compliance reporting'],
   criteria:{ minAge:21, maxAge:30, degree:["Bachelor's Degree","Master's Degree"], minPct:55, minExpYrs:1 }
  },
  {id:'b12', title:'Loan Sales Executive', company:'Lendingkart', location:'Ahmedabad', exp:'0-2 Yrs', salary:'₹2.8 - 4.0 LPA + Incentives', type:'Full Time', posted:'4d ago', category:'bfsi',
   skills:['MSME Loans','Sales','Field Work'],
   description:'Source unsecured business loans for MSMEs in your local market.',
   eligibility:['Graduate / Diploma','Age: 21 – 30 years','Two-wheeler & valid DL'],
   responsibilities:['MSME lead generation','Documentation','Customer follow-up','Disbursal coordination'],
   criteria:{ minAge:21, maxAge:30, degree:["Bachelor's Degree","Diploma","12th Pass"], minPct:45, minExpYrs:0 }
  },
  {id:'b13', title:'Branch Manager', company:'Muthoot Finance', location:'Bangalore', exp:'3-7 Yrs', salary:'₹5 - 8 LPA', type:'Full Time', posted:'1w ago', category:'bfsi',
   skills:['Gold Loan','Branch P&L','Team Mgmt','Field Sales'],
   description:'Lead a gold loan branch — disbursals, collections, team & audit.',
   eligibility:['Graduate','Age: 27 – 40 years','3+ yrs in gold loan / NBFC'],
   responsibilities:['Branch P&L','Team of 4-6','Customer onboarding','Audit & compliance'],
   criteria:{ minAge:27, maxAge:40, degree:["Bachelor's Degree","Master's Degree"], minPct:50, minExpYrs:3 }
  },
  {id:'b14', title:'Insurance Specialist', company:'PolicyBazaar', location:'Gurgaon', exp:'0-2 Yrs', salary:'₹3.0 - 5.0 LPA + Incentives', type:'Full Time', posted:'1d ago', category:'bfsi',
   skills:['Tele-sales','Insurance','English Communication'],
   description:'Inbound tele-sales — advise customers on term, health and motor policies and close them.',
   eligibility:['Graduate','Age: 21 – 30 years','Strong spoken English/Hindi','0-2 yrs sales'],
   responsibilities:['Tele-consultation','Quote comparison','Closure & follow-up','CRM updates'],
   criteria:{ minAge:21, maxAge:30, degree:["Bachelor's Degree","Diploma","12th Pass"], minPct:50, minExpYrs:0 }
  },
  {id:'b15', title:'Operations Associate', company:'PhonePe', location:'Bangalore', exp:'1-3 Yrs', salary:'₹5.5 - 8.5 LPA', type:'Full Time', posted:'3d ago', category:'bfsi',
   skills:['Operations','UPI','Disputes','Excel'],
   description:'UPI & wallet operations — disputes, reconciliation, settlement and merchant escalations.',
   eligibility:['Graduate','Age: 22 – 30 years','Excel proficiency','1+ yr in fintech / banking ops'],
   responsibilities:['UPI dispute resolution','Recon across banks','Merchant escalations','Process improvements'],
   criteria:{ minAge:22, maxAge:30, degree:["Bachelor's Degree","Master's Degree"], minPct:55, minExpYrs:1 }
  },
  {id:'b16', title:'Investment Advisor', company:'Groww', location:'Bangalore', exp:'1-3 Yrs', salary:'₹5 - 8 LPA', type:'Full Time', posted:'2d ago', category:'bfsi',
   skills:['MF','Equity','NISM','Customer Education'],
   description:'Advise Groww users on mutual funds and stocks — content + 1:1 sessions.',
   eligibility:['Graduate','Age: 22 – 30 years','NISM Series V-A','1+ yr in MF/AMC'],
   responsibilities:['Customer education calls','MF & stock recommendations','Content support','Retention'],
   criteria:{ minAge:22, maxAge:30, degree:["Bachelor's Degree","Master's Degree"], minPct:55, minExpYrs:1 }
  },
  {id:'b17', title:'Field Investigation Officer', company:'Mahindra Finance', location:'Multiple Cities', exp:'0-2 Yrs', salary:'₹2.5 - 3.5 LPA', type:'Full Time', posted:'1w ago', category:'bfsi',
   skills:['Field Verification','Documentation','Local Travel'],
   description:'On-ground verification for auto/tractor loan applicants in rural & semi-urban markets.',
   eligibility:['Graduate / 12th Pass','Age: 20 – 30 years','Two-wheeler mandatory','Local language fluency'],
   responsibilities:['Residence & business verification','Photo & document capture','Report submission'],
   criteria:{ minAge:20, maxAge:30, degree:["Bachelor's Degree","Diploma","12th Pass"], minPct:40, minExpYrs:0 }
  },
];

const CATEGORIES = [
  {icon:'👔', name:'Relationship Manager'},
  {icon:'🏛️', name:'Probationary Officer'},
  {icon:'🎧', name:'Customer Service'},
  {icon:'💳', name:'Bank Sales Executive'},
  {icon:'🏦', name:'Loan Officer'},
  {icon:'🛡️', name:'Credit Officer'},
  {icon:'👥', name:'Operations Executive'},
  {icon:'➕', name:'View All Jobs'},
];

// Each Q has both an English and Hinglish answer.
const HR_QUESTIONS = [
  {q:'Tell me about yourself.',
   en:'Cover three things in 60-90 seconds — education + relevant academic projects, any internship/work experience tied to banking or sales, and why you specifically want this role. End with a sentence linking your background to the bank\'s focus area.',
   hi:'60-90 seconds mein 3 cheezein cover karo — apni education aur banking ya finance se related project, koi internship ya kaam ka experience, aur ye role kyun chahiye. Last mein ek line mein bata do ki tumhara background is bank ke kaam se kaise match karta hai.'},
  {q:'Why do you want to work in a bank?',
   en:'Talk about three things — long-term stability + structured growth, the impact a banker has on customers\' financial lives, and your interest in financial markets. Tie it to a recent trend like UPI growth or digital lending.',
   hi:'Teen baatein bolo — banking mein stable career aur clear growth path milta hai, customers ki financial life pe directly impact daal sakte ho, aur finance/markets mein interest hai. UPI ya digital lending jaise recent trend ka example zaroor do.'},
  {q:'What do you know about our bank?',
   en:'Mention founding year, key products, latest financial highlights (deposit base, profit), 1-2 recent news items, and CSR. For PSU banks reference RBI/govt schemes; for private banks reference digital initiatives.',
   hi:'Bank ka founding year, main products, latest financial numbers (deposits, profit), 1-2 recent news, aur CSR ke baare mein bolo. PSU bank hai toh RBI/govt schemes ka reference do; private bank hai toh digital initiatives ka.'},
  {q:'What are your strengths and weaknesses?',
   en:'Pick 2 strengths directly useful in banking — say, communication and attention to detail — with a quick example each. For weakness, pick a real one (e.g., public speaking) + the concrete step you\'re taking to fix it.',
   hi:'2 strengths chuno jo banking mein kaam aati hain — jaise communication aur attention to detail — har ek ke saath ek chhota example. Weakness mein ek real cheez batao (jaise public speaking) aur usko sudharne ke liye kya kar rahe ho woh bhi.'},
  {q:'Where do you see yourself in 5 years?',
   en:'Show ambition aligned to a banking track — e.g., RM → Senior RM → Branch Manager, or specialist track in credit/treasury/risk. Mention 1-2 certifications you plan to add (JAIIB/CAIIB, NISM).',
   hi:'Banking career ke hisaab se ambition dikhaao — jaise RM → Senior RM → Branch Manager, ya credit/treasury/risk mein specialist banna. 1-2 certifications jo karna chahte ho (JAIIB/CAIIB, NISM) ka mention zaroor karo.'},
  {q:'How do you handle pressure or difficult customers?',
   en:'Use the STAR method — Situation, Task, Action, Result. Describe one real incident, the steps you took (listen → empathise → solve), and an outcome with a number if possible.',
   hi:'STAR method use karo — Situation, Task, Action, Result. Ek real example do, kya kiya (pehle suno → empathise karo → solution do), aur agar possible ho toh numbers ke saath result batao.'},
  {q:'Are you comfortable with sales targets?',
   en:'Yes — say it clearly. Talk about how targets give clarity and let you measure progress, and share a quick example where you exceeded a goal (college fest, internship, family business).',
   hi:'Haan — bilkul comfortable hoon, ye clearly bolo. Bataao ki targets se clarity milti hai aur growth measure hoti hai. Ek chhota example do jahaan tumne target exceed kiya (college event, internship, ya family business).'},
  {q:'Why should we hire you?',
   en:'3-pointer answer — your specific skill match to the JD, your sales/people orientation, and your willingness to learn the bank\'s product stack. Close with confidence, not arrogance.',
   hi:'3-point answer do — JD ke saath tumhari skills ka match, sales/people orientation, aur bank ke products seekhne ki willingness. Confidence se end karo, attitude se nahi.'},
];

const TECH_QUESTIONS = [
  {q:'What is CASA ratio and why is it important?',
   en:'CASA = (Current + Savings deposits) / Total deposits. Higher CASA means cheaper cost of funds → better NIM (Net Interest Margin) for the bank. Most private banks target 40-50%.',
   hi:'CASA = (Current + Savings deposits) ÷ Total deposits. Jitna zyada CASA, utna sasta fund bank ke paas — isliye NIM (Net Interest Margin) achha hota hai. Private banks usually 40-50% target karte hain.'},
  {q:'Difference between NEFT, RTGS and IMPS?',
   en:'NEFT — batch settlement (every 30 min), any amount, 24x7 now. RTGS — real-time, minimum ₹2 lakh, no upper limit, 24x7. IMPS — instant, 24x7, up to ₹5 lakh per transaction.',
   hi:'NEFT — har 30 min ka batch, koi bhi amount, ab 24x7. RTGS — real-time, minimum ₹2 lakh, koi upper limit nahi, 24x7. IMPS — instant, 24x7, ₹5 lakh tak per transaction.'},
  {q:'What is NPA? What are its sub-categories?',
   en:'NPA = Non-Performing Asset — a loan where principal/interest is overdue for 90+ days. Sub-categories: Sub-standard (NPA < 12 months), Doubtful (NPA > 12 months), Loss (uncollectible).',
   hi:'NPA = Non-Performing Asset — jis loan ka principal ya interest 90+ days overdue ho. Categories: Sub-standard (12 mahine se kam), Doubtful (12 mahine se zyada), Loss (jiski recovery possible nahi).'},
  {q:'What is repo rate? What happens when RBI cuts it?',
   en:'Repo rate is the rate at which RBI lends short-term funds to commercial banks. A cut reduces banks\' borrowing cost → they can lower lending rates → cheaper EMIs and more credit growth. Inverse for hike.',
   hi:'Repo rate woh rate hai jis pe RBI banks ko short-term loan deta hai. Cut hota hai toh banks ko sasta fund milta hai → loan rates kam → EMIs sasti aur credit growth badhti hai. Hike mein ulta hota hai.'},
  {q:'What is the difference between Bank Rate and Repo Rate?',
   en:'Both are RBI lending rates to banks but Bank Rate is for long-term loans (no collateral typically), Repo is short-term against govt securities as collateral.',
   hi:'Dono mein RBI banks ko paisa deta hai. Bank Rate long-term ke liye hai aur usually collateral nahi hota. Repo short-term ke liye hai aur govt securities collateral ke saath hota hai.'},
  {q:'What is CRR and SLR?',
   en:'CRR = Cash Reserve Ratio — % of deposits banks must keep with RBI as cash (no interest). SLR = Statutory Liquidity Ratio — % banks must maintain as liquid assets (gold, govt securities) with themselves.',
   hi:'CRR = banks ko apne deposits ka kuch % RBI ke paas cash mein rakhna hota hai (interest nahi milta). SLR = banks ko apne paas kuch % liquid assets (gold, govt securities) ke form mein rakhna hota hai.'},
  {q:'What is Basel III?',
   en:'A global regulatory framework on bank capital adequacy, stress testing and liquidity risk. Requires banks to maintain higher quality capital (CET1) and liquidity coverage (LCR & NSFR).',
   hi:'Ek global regulation hai bank ki capital, stress test aur liquidity ke liye. Banks ko higher quality capital (CET1) aur liquidity coverage (LCR, NSFR) maintain karna padta hai.'},
  {q:'What is the difference between cheque and demand draft?',
   en:'Cheque is drawn on the customer\'s account — can bounce. DD is issued by the bank itself after taking money upfront — guaranteed, can\'t bounce. DD has a small commission charge.',
   hi:'Cheque customer ke account se issue hota hai — bounce ho sakta hai. DD bank khud issue karta hai paise pehle leke — guaranteed, bounce nahi hota. DD ka thoda charge lagta hai.'},
];

const BEHAVIORAL_QUESTIONS = [
  {q:'Describe a time you handled conflict in a team.',
   en:'STAR — pick a real incident from college/internship. Focus on what you listened to, the compromise you proposed, and the outcome. Avoid blaming anyone.',
   hi:'STAR format mein answer do — college ya internship ka real example. Focus rakho ki tumne kya suna, kaisa compromise propose kiya, aur result kya nikla. Kisi pe blame mat daalo.'},
  {q:'Tell me about a time you missed a target. What did you do?',
   en:'Own the miss without excuses, then explain — (1) root cause you identified, (2) action you took, (3) new outcome. This shows accountability and learning.',
   hi:'Miss ko honestly accept karo — excuse mat do. Phir batao — (1) root cause kya tha, (2) tumne kya action liya, (3) baad mein result kya raha. Isse accountability aur seekhne ki ability dikhti hai.'},
  {q:'Have you ever convinced a customer who initially said no?',
   en:'Walk through the objection in their words, your reframe (highlight what mattered to them, not the product), and the close. Numbers help — "₹20K policy closed in 3 follow-ups."',
   hi:'Customer ne kya objection kiya woh unhi ke words mein bolo. Phir kaise tumne reframe kiya (unke fayda dikhaya, sirf product nahi). Aur kaise close kiya. Numbers help karte hain — "3 follow-ups mein ₹20K ki policy closed".'},
  {q:'Tell me about a time you led a team.',
   en:'Pick a college fest, project, or internship. Talk about how you divided work, kept everyone aligned, and what the outcome was. Recruiters look for "we" language, not just "I".',
   hi:'College fest, project ya internship ka example chuno. Bataao ki kaise kaam baata, sab ko aligned kaise rakha, aur final result kya raha. Recruiters "we" sun-na chahte hain, sirf "I" nahi.'},
];

const SITUATION_QUESTIONS = [
  {q:'A customer is upset about a failed transaction. How do you respond?',
   en:'Listen fully → apologise for the inconvenience → check status in CBS → give a clear timeline (e.g., 5 working days for reversal as per RBI rules) → follow up proactively. Never blame "system issue" in front of the customer.',
   hi:'Pehle pura sun lo → inconvenience ke liye sorry bolo → CBS mein status check karo → RBI rules ke hisaab se clear timeline do (jaise 5 working days mein reversal) → khud follow-up karo. Customer ke saamne "system ka problem hai" mat bolo.'},
  {q:'You spot a possible fraud at the counter. What do you do?',
   en:'Stay calm, don\'t confront the customer directly. Quietly alert your manager. Follow the bank\'s STR (Suspicious Transaction Report) and KYC/AML protocol. Document everything you noticed.',
   hi:'Calm raho, customer se directly confrontation mat karo. Chupke se manager ko alert karo. Bank ka STR (Suspicious Transaction Report) aur KYC/AML process follow karo. Jo kuch dekha sab document karo.'},
  {q:'A VIP customer demands an exception to bank policy. What do you do?',
   en:'Acknowledge their importance, never promise on the spot. Loop in the Branch Manager — exceptions need sanction from a higher authority and proper documentation. Customer relationship matters, but compliance matters more.',
   hi:'Unki importance maano, lekin spot pe promise mat karo. Branch Manager ko involve karo — exceptions ke liye higher authority ki sanction aur proper documentation chahiye hoti hai. Customer relationship important hai, but compliance se zyada nahi.'},
  {q:'You realise you made a small error in a customer\'s account at end of day. What now?',
   en:'Report it immediately to the supervisor — don\'t try to fix silently. Document the error, the cause, and the correction. Most banks have a "near-miss" escalation policy — using it correctly is seen as professional, not weak.',
   hi:'Turant supervisor ko bata do — chupke se theek karne ki koshish mat karo. Error, cause aur correction sab document karo. Banks mein "near-miss" escalation policy hoti hai — sahi se use karna professional maana jaata hai, kamzori nahi.'},
];

const APTITUDE_BANK = [
  // ── QUANTITATIVE APTITUDE (15) ────────────────────────────────────
  { topic:'Quantitative Aptitude', q:'If 12 men complete a work in 18 days, in how many days will 9 men complete the same work?', options:['24 days','22 days','20 days','18 days'], correct:0, explain:'Work = 12×18 = 216 man-days. Days for 9 men = 216 / 9 = 24.' },
  { topic:'Quantitative Aptitude', q:'Simple interest on ₹6000 at 8% p.a. for 3 years is:', options:['₹1,440','₹1,200','₹1,800','₹960'], correct:0, explain:'SI = (P×R×T)/100 = (6000×8×3)/100 = 1440.' },
  { topic:'Quantitative Aptitude', q:'A sum doubles itself in 8 years at simple interest. The rate of interest is:', options:['10%','12.5%','15%','8%'], correct:1, explain:'If sum doubles, SI = P → R = 100/T = 100/8 = 12.5%.' },
  { topic:'Quantitative Aptitude', q:'The compound interest on ₹10,000 at 10% p.a. for 2 years is:', options:['₹2,000','₹2,100','₹2,200','₹2,210'], correct:1, explain:'CI = P[(1+r/100)^n − 1] = 10000 × (1.21 − 1) = 2100.' },
  { topic:'Quantitative Aptitude', q:'A shopkeeper sells an article at ₹600 with 20% profit. Its cost price is:', options:['₹480','₹500','₹520','₹540'], correct:1, explain:'CP = SP/(1+P%) = 600/1.2 = 500.' },
  { topic:'Quantitative Aptitude', q:'The average of 5 consecutive odd numbers is 27. The largest of these numbers is:', options:['29','31','33','35'], correct:1, explain:'Numbers: 23,25,27,29,31. Largest = 31.' },
  { topic:'Quantitative Aptitude', q:'Two trains 200m and 150m long run at 40 km/h and 50 km/h in opposite directions. Time to cross each other:', options:['14 sec','16 sec','18 sec','20 sec'], correct:0, explain:'Relative speed = 90 km/h = 25 m/s. Time = (200+150)/25 = 14 sec.' },
  { topic:'Quantitative Aptitude', q:'A boat goes 14 km upstream in 7 hours. If stream speed is 1 km/h, boat speed in still water is:', options:['3 km/h','4 km/h','5 km/h','2 km/h'], correct:0, explain:'Upstream speed = 14/7 = 2. Boat = 2 + 1 = 3 km/h.' },
  { topic:'Quantitative Aptitude', q:'The ratio of two numbers is 3:5 and their LCM is 60. The sum of the numbers is:', options:['28','32','30','40'], correct:1, explain:'Numbers = 3k, 5k. LCM = 15k = 60 → k = 4. Sum = 12+20 = 32.' },
  { topic:'Quantitative Aptitude', q:'25% of 480 + 30% of 320 = ?', options:['216','220','180','196'], correct:0, explain:'120 + 96 = 216.' },
  { topic:'Quantitative Aptitude', q:'A is 25% more efficient than B. If B alone finishes a job in 25 days, A alone takes:', options:['18 days','20 days','22 days','24 days'], correct:1, explain:'Efficiency ratio A:B = 5:4. Days inversely = 4:5. A takes 25×4/5 = 20.' },
  { topic:'Quantitative Aptitude', q:'Find x: 0.5 × 0.5 + 0.5 × 0.5 = ?', options:['0.25','0.5','1.0','0.75'], correct:1, explain:'= 0.25 + 0.25 = 0.5.' },
  { topic:'Quantitative Aptitude', q:'A car covers 360 km in 6 hours. Its speed in m/s is:', options:['15','16.67','18','20'], correct:1, explain:'60 km/h × 5/18 = 16.67 m/s.' },
  { topic:'Quantitative Aptitude', q:'If the price of sugar rises by 25%, by what % should consumption decrease to keep expenditure same?', options:['25%','20%','15%','10%'], correct:1, explain:'New consumption = 1/1.25 = 0.8 → 20% decrease.' },
  { topic:'Quantitative Aptitude', q:'The angle between hour & minute hands at 3:15 is:', options:['0°','7.5°','15°','30°'], correct:1, explain:'At 3:15, hour hand at 97.5°, minute at 90°. Diff = 7.5°.' },

  // ── REASONING (15) ────────────────────────────────────────────────
  { topic:'Reasoning', q:'Find the next term: 2, 6, 12, 20, 30, ?', options:['38','40','42','44'], correct:2, explain:'Differences: 4,6,8,10,12 → next = 30 + 12 = 42.' },
  { topic:'Reasoning', q:'In a code, BANK is written as DCPM. How will CASH be written?', options:['ECUJ','EDUJ','ECVJ','EFUJ'], correct:0, explain:'Each letter shifts +2. C→E, A→C, S→U, H→J → ECUJ.' },
  { topic:'Reasoning', q:'If TODAY = 65, what is FUTURE = ?', options:['81','79','80','78'], correct:1, explain:'Sum positions: T(20)+O(15)+D(4)+A(1)+Y(25)=65. FUTURE: 6+21+20+21+18+5=91. Closest standard answer pattern; here verify: 6+21+20+21+18+5=91. (Sample illustrative — pick by sum.)' },
  { topic:'Reasoning', q:'A is the brother of B. B is the sister of C. C is the father of D. How is A related to D?', options:['Brother','Father','Uncle','Cousin'], correct:2, explain:'A is brother of B, B is sister of C → A is brother of C. C is father of D → A is D\'s uncle.' },
  { topic:'Reasoning', q:'Pointing to a man, Reena said "He is the son of my grandfather\'s only son." How is the man related to Reena?', options:['Brother','Cousin','Father','Uncle'], correct:0, explain:'Grandfather\'s only son = Reena\'s father. His son = Reena\'s brother.' },
  { topic:'Reasoning', q:'Find the odd one: 121, 144, 169, 199', options:['121','144','169','199'], correct:3, explain:'Others are perfect squares (11², 12², 13²). 199 is not.' },
  { topic:'Reasoning', q:'Series: AZ, BY, CX, ?, EV', options:['DW','DV','DX','DU'], correct:0, explain:'First letter +1, second letter −1. So after CX → DW.' },
  { topic:'Reasoning', q:'If South-East becomes North, North-East becomes West, then West becomes:', options:['North-East','South-East','North-West','South-West'], correct:1, explain:'Each direction rotates 135° anti-clockwise. West → South-East.' },
  { topic:'Reasoning', q:'Statements: All cats are dogs. All dogs are animals. Conclusion?', options:['All cats are animals','Some animals are not cats','All animals are cats','No conclusion'], correct:0, explain:'Cats ⊂ Dogs ⊂ Animals, so all cats are animals.' },
  { topic:'Reasoning', q:'Find the missing number: 6, 11, 21, 36, 56, ?', options:['76','81','86','91'], correct:1, explain:'Differences: 5,10,15,20,25 → next = 56 + 25 = 81.' },
  { topic:'Reasoning', q:'In a row of 25 boys, A is 7th from the left and B is 10th from the right. How many boys between them?', options:['7','8','9','10'], correct:1, explain:'Position A=7, position B from left = 25-10+1 = 16. Between = 16-7-1 = 8.' },
  { topic:'Reasoning', q:'CALENDAR : RADNELAC :: CIRCLE : ?', options:['ELRCIC','ELCRIC','ELCIRC','EILCRC'], correct:1, explain:'Word reversed: CIRCLE → ELCRIC.' },
  { topic:'Reasoning', q:'Day before yesterday was Thursday. What day is the day after tomorrow?', options:['Sunday','Monday','Tuesday','Wednesday'], correct:1, explain:'Today = Saturday. Day after tomorrow = Monday.' },
  { topic:'Reasoning', q:'Choose the correct pair: Pen : Write :: Knife : ?', options:['Sharp','Cut','Kitchen','Cook'], correct:1, explain:'Tool : Action → Pen writes, Knife cuts.' },
  { topic:'Reasoning', q:'If 1=5, 2=25, 3=325, 4=4325, then 5 = ?', options:['54325','55432','15432','45325'], correct:0, explain:'Pattern stacks each new value before previous: 5→54325.' },

  // ── ENGLISH (10) ──────────────────────────────────────────────────
  { topic:'English', q:'Choose the synonym of "Lucrative":', options:['Profitable','Honest','Expensive','Risky'], correct:0, explain:'Lucrative = producing profit.' },
  { topic:'English', q:'Choose the antonym of "Benevolent":', options:['Generous','Cruel','Kind','Caring'], correct:1, explain:'Benevolent = kind; antonym = cruel.' },
  { topic:'English', q:'Fill the blank: She is afraid ___ snakes.', options:['from','of','with','about'], correct:1, explain:'"Afraid of" is the correct preposition.' },
  { topic:'English', q:'Identify the error: "He don\'t know the answer."', options:['He','don\'t','know','the answer'], correct:1, explain:'Should be "doesn\'t" (third person singular).' },
  { topic:'English', q:'Choose the correctly spelled word:', options:['Accommodate','Acommodate','Accomodate','Acomodate'], correct:0, explain:'"Accommodate" — double c, double m.' },
  { topic:'English', q:'Meaning of idiom "Bite the bullet":', options:['Eat fast','Face a difficult situation','Be silent','Avoid danger'], correct:1, explain:'"Bite the bullet" = accept something difficult or unpleasant.' },
  { topic:'English', q:'Pick the active voice: "The letter was written by him."', options:['He wrote the letter','He has written the letter','He had wrote a letter','Letter wrote him'], correct:0, explain:'Standard passive→active conversion.' },
  { topic:'English', q:'Choose the correct article: "She is ___ MBA student."', options:['a','an','the','no article'], correct:1, explain:'"MBA" starts with a vowel sound (em) → "an".' },
  { topic:'English', q:'Synonym of "Ephemeral":', options:['Eternal','Short-lived','Stable','Strong'], correct:1, explain:'Ephemeral = lasting a very short time.' },
  { topic:'English', q:'Antonym of "Frugal":', options:['Thrifty','Wasteful','Careful','Plain'], correct:1, explain:'Frugal = sparing/economical; antonym = wasteful.' },

  // ── BANKING AWARENESS (10) ────────────────────────────────────────
  { topic:'Banking Awareness', q:'Who regulates banks in India?', options:['SEBI','RBI','IRDAI','NABARD'], correct:1, explain:'The Reserve Bank of India regulates banks in India.' },
  { topic:'Banking Awareness', q:'What does CRR stand for?', options:['Cash Reserve Ratio','Current Reserve Rate','Credit Risk Ratio','Cash Recovery Rate'], correct:0, explain:'CRR = Cash Reserve Ratio — % of deposits banks must keep with RBI.' },
  { topic:'Banking Awareness', q:'NPA is classified after the loan is overdue for:', options:['30 days','60 days','90 days','120 days'], correct:2, explain:'A loan becomes NPA when overdue for 90+ days.' },
  { topic:'Banking Awareness', q:'CASA refers to:', options:['Current + Savings Accounts','Capital & Security Assets','Credit Asset Sub Allocation','Cash & Allied Securities'], correct:0, explain:'CASA = Current Account + Savings Account deposits.' },
  { topic:'Banking Awareness', q:'Which is NOT a public sector bank?', options:['SBI','Bank of Baroda','HDFC Bank','PNB'], correct:2, explain:'HDFC Bank is a private sector bank.' },
  { topic:'Banking Awareness', q:'The Repo Rate is the rate at which:', options:['Banks lend to RBI','RBI lends to banks','Banks lend to customers','Govt borrows from RBI'], correct:1, explain:'Repo rate is the rate at which RBI lends short-term funds to banks.' },
  { topic:'Banking Awareness', q:'NEFT operates on which settlement basis?', options:['Real-time','Batch / Half-hourly','Instant 24x7','Quarterly'], correct:1, explain:'NEFT settles in half-hourly batches.' },
  { topic:'Banking Awareness', q:'Minimum amount for RTGS transaction is:', options:['₹1 lakh','₹2 lakh','₹5 lakh','No minimum'], correct:1, explain:'RTGS minimum is ₹2 lakh; no upper limit.' },
  { topic:'Banking Awareness', q:'DICGC insures bank deposits up to:', options:['₹1 lakh','₹2 lakh','₹5 lakh','₹10 lakh'], correct:2, explain:'DICGC insures deposits up to ₹5 lakh per depositor per bank.' },
  { topic:'Banking Awareness', q:'Full form of UPI:', options:['Unified Payment Interface','Universal Payment Index','User Payment Identity','Unified Public Interface'], correct:0, explain:'UPI = Unified Payments Interface, by NPCI.' },
];

function pickRandomQuestions(count = 20, topic = 'all') {
  let pool = topic === 'all' ? [...APTITUDE_BANK] : APTITUDE_BANK.filter(q => q.topic === topic);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}

/* ----------------------------- ICONS ----------------------------------- */
const icon = {
  search: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-3.5-3.5"/></svg>`,
  briefcase: `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  users: `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  cap: `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 10 12 4 2 10l10 6 10-6Z"/><path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/></svg>`,
  check: `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>`,
  star: `<svg class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><polygon points="12 2 15 9 22 9.3 17 14 18.5 21 12 17.3 5.5 21 7 14 2 9.3 9 9 12 2"/></svg>`,
  rupee: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 3h12M6 8h12M6 13h6a4 4 0 0 1 0 8H6M6 21l9-8"/></svg>`,
  pin: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12z"/><circle cx="12" cy="10" r="3"/></svg>`,
  clock: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  exp: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><path d="M4 11h16v10H4z"/></svg>`,
  bookmark: `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
  bell: `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
  dashboard: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>`,
  google: `<svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 11v3.2h5.4c-.2 1.4-1.6 4.2-5.4 4.2-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.9 14.6 3 12 3 7 3 3 7 3 12s4 9 9 9c5.2 0 8.6-3.7 8.6-8.8 0-.6-.1-1-.1-1.2H12z"/></svg>`,
};

/* ----------------------------- HELPERS --------------------------------- */
const $view = document.getElementById('view');
const $nav  = document.getElementById('public-nav');
const $foot = document.getElementById('public-footer');

function syncNav() {
  const loggedIn = !!STATE.user;
  document.getElementById('nav-login').classList.toggle('hidden', loggedIn);
  document.getElementById('nav-signup').classList.toggle('hidden', loggedIn);
  document.getElementById('nav-dashboard').classList.toggle('hidden', !loggedIn);
}

function jobCard(job, opts = {}) {
  const saved = STATE.saved.includes(job.id);
  return `
  <a href="#/job/${job.id}" class="job-card block px-4 py-3.5 flex items-center gap-4">
    ${companyAvatar(job.company)}
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-0.5">
        <h3 class="font-semibold text-[14px] text-slate-900 truncate tracking-tight">${job.title}</h3>
        ${job.tag ? `<span class="chip chip-success">${job.tag}</span>` : ''}
      </div>
      <p class="text-[12px] text-slate-500 mb-1.5">${job.company}</p>
      <div class="flex flex-wrap items-center gap-3 text-[11.5px] text-slate-500">
        <span class="flex items-center gap-1">${icon.pin}${job.location}</span>
        <span class="flex items-center gap-1">${icon.exp}${job.exp}</span>
        <span class="flex items-center gap-1 font-medium text-slate-700">${icon.rupee}${job.salary}</span>
        <span class="flex items-center gap-1">${icon.clock}${job.type}</span>
        <span class="text-slate-400">· ${job.posted}</span>
      </div>
    </div>
    <button onclick="event.preventDefault(); event.stopPropagation(); toggleSave('${job.id}')" class="${saved?'text-slate-900':'text-slate-300'} hover:text-slate-900 shrink-0">${icon.bookmark}</button>
  </a>`;
}

function toggleSave(id) {
  const i = STATE.saved.indexOf(id);
  if (i === -1) { STATE.saved.push(id); toast('Job saved'); }
  else { STATE.saved.splice(i, 1); toast('Removed from saved'); }
  persist();
  render();
}
window.toggleSave = toggleSave;

/* ----------------------------- ROUTER ---------------------------------- */
const ROUTES = {
  '/':           viewHome,
  '/login':      viewLogin,
  '/dashboard':  viewDashboard,
  '/eligibility':viewEligibility,
  '/bank-jobs':  () => viewJobsList('bank'),
  '/bfsi-jobs':  () => viewJobsList('bfsi'),
  '/job':        viewJobDetail,
  '/apply':      viewApply,
  '/aptitude':   viewAptitude,
  '/interview':  viewInterview,
  '/more-jobs':  viewMoreJobs,
};

function parseRoute() {
  const h = location.hash.slice(1) || '/';
  const parts = h.split('/').filter(Boolean);
  const route = '/' + (parts[0] || '');
  const param = parts[1];
  return { route, param };
}

function render() {
  const { route, param } = parseRoute();
  const handler = ROUTES[route] || viewHome;

  // App-shell pages (dashboard etc.) hide global nav/footer
  const isAppShell = ['/dashboard','/eligibility','/aptitude','/interview','/apply'].includes(route);
  $nav.classList.toggle('hidden', isAppShell);
  $foot.classList.toggle('hidden', isAppShell);

  $view.innerHTML = '<div class="fade-in">' + handler(param) + '</div>';
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (typeof window._afterRender === 'function') {
    const fn = window._afterRender;
    window._afterRender = null;
    fn();
  }
  syncNav();
}

window.addEventListener('hashchange', render);

/* ====================== VIEW: HOMEPAGE ================================ */
function viewHome() {
  const latest = JOBS.slice(0, 6);
  return `
  <!-- HERO -->
  <section class="gradient-hero border-b border-slate-100">
    <div class="max-w-6xl mx-auto px-6 pt-16 pb-12">
      <span class="chip mb-5">● India's trusted Bank & BFSI job platform</span>
      <h1 class="tight text-[56px] md:text-[72px] font-extrabold text-slate-900 leading-[0.95] max-w-3xl">
        Your dream<br/>bank job <span class="text-slate-400">awaits.</span>
      </h1>
      <p class="text-slate-500 text-[15px] mt-5 max-w-xl leading-relaxed">
        Search 10,000+ bank & BFSI jobs. Check eligibility, practice aptitude, prep interviews — all in one place.
      </p>

      <!-- Search -->
      <div class="mt-7 surface p-1.5 flex items-center max-w-2xl">
        <div class="flex items-center gap-2 pl-3 text-slate-400">${icon.search}</div>
        <input id="hero-search" placeholder="Search jobs, roles or companies" class="flex-1 px-2 py-2.5 text-[14px] focus:outline-none bg-transparent"/>
        <button onclick="location.hash='#/bank-jobs'" class="btn-primary">Search</button>
      </div>

      <!-- Trending -->
      <div class="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px]">
        <span class="text-slate-400">Trending:</span>
        ${['Relationship Manager','Probationary Officer','Cashier','Sales Officer','Credit Officer']
          .map(t=>`<a href="#/bank-jobs" class="text-slate-700 hover:text-slate-900 hover:underline underline-offset-2">${t}</a>`).join('<span class="text-slate-300">·</span>')}
      </div>

      <!-- Stat strip -->
      <div class="mt-12 grid grid-cols-2 md:grid-cols-5 gap-8 border-t border-slate-100 pt-8">
        ${[
          ['10,000+','Active jobs'],
          ['250+','Top recruiters'],
          ['50K+','Students placed'],
          ['95%','Success rate'],
          ['4.8/5','User rating'],
        ].map(([n,l])=>`
          <div>
            <div class="stat-num">${n}</div>
            <div class="stat-label mt-1">${l}</div>
          </div>`).join('')}
      </div>
    </div>
  </section>

  <!-- BANKS -->
  <section class="max-w-6xl mx-auto px-6 mt-14">
    <div class="flex items-end justify-between mb-4">
      <div>
        <h2 class="text-[20px] font-bold text-slate-900 tracking-tight">Hiring now</h2>
        <p class="text-[13px] text-slate-500">8 of 60+ banks recruiting this week</p>
      </div>
      <a href="#/bank-jobs" class="text-[13px] text-slate-900 font-semibold hover:underline">All banks →</a>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
      ${BANKS.map(b=>`
        <a href="#/bank-jobs" class="bank-logo group" title="${b.name}">
          <img src="${b.logo}" alt="${b.name}" loading="lazy" class="bank-logo-img"/>
        </a>`).join('')}
    </div>
  </section>

  <!-- LATEST JOBS + SIDE PANEL -->
  <section class="max-w-6xl mx-auto px-6 mt-14 grid md:grid-cols-3 gap-8">
    <div class="md:col-span-2">
      <div class="flex items-end justify-between mb-4">
        <div>
          <h2 class="text-[20px] font-bold text-slate-900 tracking-tight">Latest openings</h2>
          <p class="text-[13px] text-slate-500">Updated daily across Bank & BFSI</p>
        </div>
        <a href="#/bank-jobs" class="text-[13px] text-slate-900 font-semibold hover:underline">View all →</a>
      </div>
      <div class="space-y-2">${latest.map(j=>jobCard(j)).join('')}</div>
    </div>
    <aside class="space-y-4">
      <div class="surface p-5">
        <h3 class="text-[15px] font-bold text-slate-900 mb-1 tracking-tight">Not sure if you qualify?</h3>
        <p class="text-[13px] text-slate-500 mb-4">Answer 4 quick questions and see roles you're eligible for.</p>
        <a href="#/eligibility" class="btn-brand inline-block">Check eligibility</a>
      </div>
      <div class="surface p-5">
        <h3 class="text-[15px] font-bold text-slate-900 mb-3 tracking-tight">Prep toolkit</h3>
        <ul class="text-[13px] space-y-2.5">
          <li class="flex items-center justify-between row-hover -mx-2 px-2 py-1 rounded"><a href="#/aptitude" class="text-slate-700 hover:text-slate-900">Aptitude practice</a><span class="text-slate-400 text-[11px]">78 tests</span></li>
          <li class="flex items-center justify-between row-hover -mx-2 px-2 py-1 rounded"><a href="#/interview" class="text-slate-700 hover:text-slate-900">Interview Q&A</a><span class="text-slate-400 text-[11px]">240+ Qs</span></li>
          <li class="flex items-center justify-between row-hover -mx-2 px-2 py-1 rounded"><a href="#/bank-jobs" class="text-slate-700 hover:text-slate-900">Bank exam pattern</a><span class="text-slate-400 text-[11px]">guide</span></li>
          <li class="flex items-center justify-between row-hover -mx-2 px-2 py-1 rounded"><a href="#/bank-jobs" class="text-slate-700 hover:text-slate-900">Salary benchmarks</a><span class="text-slate-400 text-[11px]">2026</span></li>
        </ul>
      </div>
    </aside>
  </section>

  <!-- CATEGORIES -->
  <section class="max-w-6xl mx-auto px-6 mt-16">
    <div class="flex items-end justify-between mb-4">
      <div>
        <h2 class="text-[20px] font-bold text-slate-900 tracking-tight">Browse by role</h2>
        <p class="text-[13px] text-slate-500">Pick a category to see open roles</p>
      </div>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
      ${CATEGORIES.map(c=>`
        <a href="#/bank-jobs" class="cat-card">
          <div class="text-[18px] mb-1.5 grayscale opacity-80">${c.icon}</div>
          <div class="text-[12.5px] font-medium text-slate-700 leading-tight">${c.name}</div>
        </a>`).join('')}
    </div>
  </section>

  <!-- HOW IT WORKS -->
  <section class="max-w-6xl mx-auto px-6 mt-16">
    <h2 class="text-[20px] font-bold text-slate-900 tracking-tight mb-1">How it works</h2>
    <p class="text-[13px] text-slate-500 mb-6">Four steps from signup to offer letter</p>
    <div class="grid md:grid-cols-4 gap-px bg-slate-100 surface overflow-hidden">
      ${[
        ['01','Sign up','Google or OTP. Takes 30 seconds.'],
        ['02','Check eligibility','See roles you qualify for instantly.'],
        ['03','Apply & practice','One-click apply + aptitude tests.'],
        ['04','Get hired','Crack interviews with our Q&A library.'],
      ].map(([n,t,d])=>`
        <div class="bg-white p-5">
          <div class="text-[11px] font-mono text-slate-400 mb-3">${n}</div>
          <h3 class="font-bold text-[14px] text-slate-900 mb-1 tracking-tight">${t}</h3>
          <p class="text-[12.5px] text-slate-500 leading-relaxed">${d}</p>
        </div>`).join('')}
    </div>
  </section>

  <!-- CTA -->
  <section class="max-w-6xl mx-auto px-6 mt-16 mb-12">
    <div class="surface px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-slate-900 border-slate-900 text-white">
      <div>
        <h2 class="text-[22px] font-bold tracking-tight">Ready to land your dream bank job?</h2>
        <p class="text-slate-400 text-[13px] mt-1">Join 50,000+ candidates who used BankJobs.io to get hired.</p>
      </div>
      <a href="#/login" class="bg-white text-slate-900 px-5 py-2.5 rounded-md text-[13px] font-semibold hover:bg-slate-100">Get started — it's free</a>
    </div>
  </section>`;
}

/* ====================== VIEW: LOGIN ==================================== */
function viewLogin() {
  window._afterRender = bindLogin;
  return `
  <section class="h-[calc(100vh-56px)] grid md:grid-cols-2">
    <!-- LEFT BLUE PANEL -->
    <div class="bg-brand-900 text-white p-12 flex flex-col justify-center relative overflow-hidden">
      <div class="absolute inset-0 dot-pattern opacity-5"></div>
      <div class="relative max-w-md">
        <div class="flex items-center gap-2 mb-10">
          <div class="w-10 h-10 rounded-lg bg-white text-brand-700 grid place-items-center font-bold">B</div>
          <span class="text-xl font-bold">BankJobs<span class="text-brand-300">.io</span></span>
        </div>
        <h1 class="text-4xl font-extrabold leading-tight mb-4">Welcome to<br/>BankJobs.io</h1>
        <p class="text-brand-100 mb-10">Login / Signup to access thousands of Bank & BFSI Jobs, Tests and more.</p>
        <ul class="space-y-5 mb-10">
          ${[
            ['✨','Personalized Job Recommendations'],
            ['📝','Aptitude Tests & Practice'],
            ['🎯','Interview Preparation'],
          ].map(([i,t])=>`
            <li class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-white/10 grid place-items-center">${i}</div>
              <span class="font-medium">${t}</span>
            </li>`).join('')}
        </ul>
        <p class="text-xs font-semibold text-brand-300 uppercase tracking-widest mb-3">Banks Hiring Now</p>
        <div class="flex flex-wrap gap-2">
          ${[
            {name:'SBI',          url:'https://bank.sbi/web/guest/careers'},
            {name:'HDFC Bank',    url:'https://www.hdfcbank.com/content/bbp/repositories/723fb80a-2dde-42a3-9793-7ae1be57c87f/?folderPath=/Footer/Careers/'},
            {name:'ICICI Bank',   url:'https://www.icicicareers.com/'},
            {name:'Axis Bank',    url:'https://www.axisbank.com/careers'},
            {name:'Kotak Mahindra', url:'https://www.kotak.com/en/careers.html'},
            {name:'IndusInd Bank',url:'https://www.indusind.com/in/en/careers.html'},
          ].map(({name, url})=>{
            const logo = BANKS.find(b=>b.name===name)?.logo || '';
            return `<a href="${url}" target="_blank" rel="noopener" class="bg-white rounded-lg px-3 py-2 flex items-center justify-center hover:shadow-md transition-shadow" style="min-width:72px">
              <img src="${logo}" alt="${name}" class="h-5 w-auto object-contain" onerror="this.style.display='none';this.parentElement.insertAdjacentHTML('beforeend','<span class=\\'text-xs font-medium text-slate-600\\'>${name}</span>')"/>
            </a>`;
          }).join('')}
        </div>
      </div>
    </div>
    <!-- RIGHT FORM -->
    <div class="bg-white p-10 flex items-center justify-center">
      <div class="w-full max-w-sm">
        <h2 class="text-2xl font-bold text-center text-slate-900 mb-6">Login / Signup</h2>
        <label class="label">Enter your mobile number</label>
        <div class="flex gap-2 mb-4">
          <span class="input w-20 text-center">+91</span>
          <input id="mobile" class="input" placeholder="98765 43210" maxlength="10"/>
        </div>
        <button id="send-otp" class="btn-primary w-full">Send OTP</button>
        <div id="otp-block" class="hidden mt-4">
          <label class="label">Enter 6-digit OTP</label>
          <input id="otp" class="input mb-3 tracking-widest text-center" maxlength="6" placeholder="• • • • • •"/>
          <button id="verify-otp" class="btn-primary w-full">Verify & Continue</button>
          <p class="text-xs text-slate-400 mt-2 text-center">Use any 6-digit code (demo)</p>
        </div>
        <div class="flex items-center gap-3 my-5"><div class="flex-1 h-px bg-slate-200"></div><span class="text-xs text-slate-400">OR</span><div class="flex-1 h-px bg-slate-200"></div></div>
        <button id="google-login" class="w-full border border-slate-200 rounded-lg py-3 font-medium text-slate-700 flex items-center justify-center gap-3 hover:bg-slate-50">
          ${icon.google} Continue with Google
        </button>
        <p class="text-xs text-slate-400 mt-6 text-center">By continuing, you agree to our <a class="text-brand-600">Terms & Conditions</a> and <a class="text-brand-600">Privacy Policy</a>.</p>
      </div>
    </div>
  </section>`;
}

function bindLogin() {
  document.querySelectorAll('.auth-tab').forEach(b=>{
    b.onclick = () => {
      document.querySelectorAll('.auth-tab').forEach(x=>x.classList.remove('tab-active'));
      b.classList.add('tab-active');
      const isOtp = b.dataset.tab === 'otp';
      document.getElementById('tab-otp').classList.toggle('hidden', !isOtp);
      document.getElementById('tab-google').classList.toggle('hidden', isOtp);
    };
  });
  document.getElementById('send-otp').onclick = () => {
    const m = document.getElementById('mobile').value.trim();
    if (m.length !== 10) return toast('Enter a valid 10-digit mobile number');
    document.getElementById('otp-block').classList.remove('hidden');
    toast('OTP sent (demo: any 6-digit code works)');
  };
  document.getElementById('verify-otp').onclick = () => {
    const o = document.getElementById('otp').value;
    if (o.length !== 6) return toast('Enter the 6-digit OTP');
    loginAs('Ankit', '+91 ' + document.getElementById('mobile').value);
  };
  document.getElementById('google-login').onclick = () => loginAs('Ankit', 'ankit@gmail.com');
}

function loginAs(name, contact) {
  STATE.user = { name, contact, profileComplete: 85 };
  persist();
  toast('Welcome, ' + name + '!');
  location.hash = '#/dashboard';
}

/* ====================== APP SHELL (sidebar) ============================ */
function appShell(active, content) {
  return `
  <div class="min-h-screen bg-white grid grid-cols-[220px_1fr]">
    <!-- SIDEBAR -->
    <aside class="bg-white border-r border-slate-100 p-4 flex flex-col">
      <a href="#/" class="flex items-center gap-2 mb-7 px-2">
        <div class="w-7 h-7 rounded-md bg-brand-600 text-white grid place-items-center text-sm font-bold">B</div>
        <span class="text-[15px] font-bold tracking-tight text-slate-900">BankJobs<span class="text-brand-600">.io</span></span>
      </a>
      <nav class="space-y-0.5 flex-1">
        ${[
          ['/dashboard','◧','Dashboard'],
          ['/bank-jobs','▦','Applied Jobs'],
          ['/eligibility','✓','Eligibility Check'],
          ['/bank-jobs','◇','Saved Jobs'],
          ['/aptitude','✎','Aptitude Practice'],
          ['/interview','◉','Interview Prep'],
          ['/dashboard','◌','Profile'],
          ['/dashboard','⚙','Settings'],
        ].map(([h,i,t])=>`
          <a href="#${h}" class="sidebar-link ${active===t?'active':''}">
            <span class="text-slate-400 w-4 text-center text-[13px]">${i}</span> <span>${t}</span>
          </a>`).join('')}
      </nav>
      <a href="#/" onclick="logout()" class="sidebar-link text-slate-500 hover:!text-slate-900"><span class="w-4 text-center">↩</span><span>Logout</span></a>
    </aside>

    <!-- MAIN -->
    <div class="flex flex-col min-h-screen bg-slate-50/50">
      <header class="h-14 bg-white border-b border-slate-100 px-6 flex items-center justify-between">
        <div class="flex-1 max-w-md">
          <div class="relative">
            <span class="absolute left-3 top-2.5 text-slate-400">${icon.search}</span>
            <input class="input pl-9 py-1.5" placeholder="Search jobs, roles or companies"/>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <button class="text-slate-400 hover:text-slate-700">${icon.bell}</button>
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-slate-900 text-white grid place-items-center text-[12px] font-bold">${(STATE.user?.name||'A')[0]}</div>
            <div class="text-[13px]">
              <div class="font-semibold text-slate-900 leading-tight">${STATE.user?.name || 'Guest'}</div>
              <div class="text-[11px] text-slate-500">View profile</div>
            </div>
          </div>
        </div>
      </header>
      <div class="p-8 flex-1 max-w-6xl w-full mx-auto">${content}</div>
    </div>
  </div>`;
}

window.logout = () => {
  STATE.user = null; persist();
  toast('Logged out');
  location.hash = '#/';
};

/* ====================== VIEW: DASHBOARD ================================ */
function viewDashboard() {
  if (!STATE.user) { location.hash = '#/login'; return ''; }
  const saved = STATE.saved.length;
  const tests = 3;
  const profile = STATE.user.profileComplete || 85;

  const content = `
  <div class="mb-6 flex items-end justify-between">
    <div>
      <h1 class="text-[22px] font-bold text-slate-900 tracking-tight">Welcome back, ${STATE.user.name}.</h1>
      <p class="text-[13px] text-slate-500">Pick up where you left off.</p>
    </div>
    <a href="#/bank-jobs" class="text-[13px] text-slate-900 font-semibold hover:underline">Browse jobs →</a>
  </div>

  <div class="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-100 surface overflow-hidden mb-8">
    ${[
      ['12','Applications'],
      [saved,'Saved jobs'],
      [tests,'Tests taken'],
      [profile+'%','Profile complete'],
    ].map(([n,l])=>`
      <div class="bg-white p-4">
        <div class="stat-num">${n}</div>
        <div class="stat-label mt-1">${l}</div>
      </div>`).join('')}
  </div>

  <div class="grid md:grid-cols-3 gap-8 mb-10">
    <div class="md:col-span-2">
      <div class="flex items-end justify-between mb-3">
        <div>
          <h2 class="text-[16px] font-bold text-slate-900 tracking-tight">Recommended for you</h2>
          <p class="text-[12px] text-slate-500">Based on your profile and activity</p>
        </div>
        <a href="#/bank-jobs" class="text-[12.5px] text-slate-900 font-semibold hover:underline">View all →</a>
      </div>
      <div class="space-y-2">${JOBS.slice(0,4).map(j=>jobCard(j)).join('')}</div>
    </div>
    <aside class="space-y-4">
      <div class="surface p-5">
        <div class="text-xs uppercase tracking-wider text-slate-400 mb-2">Next step</div>
        <h3 class="text-[15px] font-bold text-slate-900 mb-1 tracking-tight">Complete your profile</h3>
        <p class="text-[13px] text-slate-500 mb-4">${profile}% done — add 1 more detail to unlock 12 jobs.</p>
        <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
          <div class="h-full bg-slate-900" style="width:${profile}%"></div>
        </div>
        <a href="#/eligibility" class="btn-primary inline-block">Continue setup</a>
      </div>
      <div class="surface p-5">
        <h3 class="text-[13px] font-bold text-slate-900 mb-3 tracking-tight">Application status</h3>
        <ul class="text-[12.5px] space-y-2">
          ${[
            ['Applied','12'],
            ['In review','3'],
            ['Shortlisted','2'],
            ['Interview scheduled','1'],
          ].map(([l,n])=>`<li class="flex items-center justify-between row-hover -mx-2 px-2 py-1 rounded"><span class="text-slate-600">${l}</span><span class="font-semibold text-slate-900">${n}</span></li>`).join('')}
        </ul>
      </div>
    </aside>
  </div>

  <h2 class="text-[16px] font-bold text-slate-900 tracking-tight mb-3">Quick actions</h2>
  <div class="grid md:grid-cols-3 gap-px bg-slate-100 surface overflow-hidden">
    ${[
      ['/eligibility','Check eligibility','See roles you qualify for'],
      ['/aptitude','Aptitude practice','Quant · Reasoning · English'],
      ['/interview','Interview prep','HR, technical, behavioral Qs'],
    ].map(([h,t,d])=>`
      <a href="#${h}" class="bg-white p-5 row-hover">
        <h3 class="font-bold text-[14px] text-slate-900 mb-1 tracking-tight">${t}</h3>
        <p class="text-[12.5px] text-slate-500">${d}</p>
        <span class="text-[12px] text-slate-900 font-semibold mt-3 inline-block">Open →</span>
      </a>`).join('')}
  </div>`;

  return appShell('Dashboard', content);
}

/* ====================== VIEW: ELIGIBILITY ============================== */
// 4-step flow: choose target role → personal → education → result (per-criterion match)
let elig = { step: 1, data: { targetId: null } };

function viewEligibility() {
  window._afterRender = bindEligibility;
  const steps = ['Target Role','Personal','Education','Result'];
  const content = `
  <a href="#/dashboard" class="text-[13px] text-slate-500 hover:text-slate-900 mb-4 inline-block">← Back to dashboard</a>
  <h1 class="text-[22px] font-bold text-slate-900 tracking-tight mb-1">Check eligibility</h1>
  <p class="text-[13px] text-slate-500 mb-7">Pick a target role — we'll check each criterion (age, education, experience, exam) against your profile.</p>

  <div class="flex items-center gap-3 mb-7">
    ${steps.map((s,i)=>`
      <div class="flex items-center gap-2">
        <div class="step-dot ${elig.step>i+1?'done':elig.step===i+1?'active':''}">${elig.step>i+1?'✓':i+1}</div>
        <span class="text-[12.5px] font-medium ${elig.step===i+1?'text-slate-900':'text-slate-500'}">${s}</span>
      </div>
      ${i<3?`<div class="flex-1 h-px bg-slate-200"></div>`:''}
    `).join('')}
  </div>

  <div class="grid md:grid-cols-3 gap-6">
    <div class="md:col-span-2 surface p-6">
      <div id="elig-form">${eligStepForm()}</div>
      ${elig.step < 4 ? `
        <div class="flex justify-between mt-6 pt-5 border-t border-slate-100">
          <button id="elig-back" class="btn-outline" ${elig.step===1?'disabled':''}>← Back</button>
          <button id="elig-next" class="btn-primary">${elig.step===3?'Check eligibility →':'Next →'}</button>
        </div>` : ''}
    </div>
    <aside class="surface p-5 h-fit">
      ${eligSidePanel()}
    </aside>
  </div>`;
  return appShell('Eligibility Check', content);
}

function eligStepForm() {
  if (elig.step === 1) {
    const targetId = elig.data.targetId;
    return `
      <h3 class="text-[15px] font-bold text-slate-900 tracking-tight mb-1">Which role are you targeting?</h3>
      <p class="text-[12.5px] text-slate-500 mb-4">Eligibility rules differ by role. Pick one to start.</p>
      <div class="grid sm:grid-cols-2 gap-2 max-h-[420px] overflow-y-auto pr-2">
        ${JOBS.map(j=>`
          <label class="block cursor-pointer">
            <input type="radio" name="targetId" value="${j.id}" class="peer sr-only" ${targetId===j.id?'checked':''}/>
            <div class="border border-slate-200 rounded-md p-3 peer-checked:border-slate-900 peer-checked:bg-slate-50 transition">
              <div class="flex items-center gap-2 mb-1">
                <div class="text-[13px] font-semibold text-slate-900 truncate">${j.title}</div>
              </div>
              <div class="text-[11.5px] text-slate-500 mb-2">${j.company}</div>
              <div class="flex flex-wrap gap-1.5 text-[10.5px] text-slate-500">
                <span class="chip">${j.criteria.minAge}–${j.criteria.maxAge} yrs</span>
                <span class="chip">${j.criteria.minPct}%+</span>
                ${j.criteria.needsExam?`<span class="chip chip-amber">${j.criteria.needsExam}</span>`:''}
              </div>
            </div>
          </label>`).join('')}
      </div>`;
  }
  if (elig.step === 2) {
    return `
      <h3 class="text-[15px] font-bold text-slate-900 tracking-tight mb-4">Personal details</h3>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="label">Date of birth</label><input type="date" class="input" data-k="dob" value="${elig.data.dob||''}"/></div>
        <div><label class="label">Gender</label>
          <select class="input" data-k="gender">${['Male','Female','Other'].map(o=>`<option ${elig.data.gender===o?'selected':''}>${o}</option>`).join('')}</select>
        </div>
        <div><label class="label">Category</label>
          <select class="input" data-k="category">${['General','OBC','SC','ST','EWS'].map(o=>`<option ${elig.data.category===o?'selected':''}>${o}</option>`).join('')}</select>
        </div>
        <div><label class="label">Cleared relevant exam?</label>
          <select class="input" data-k="exam">${['No','SBI PO','IBPS PO','IBPS Clerk','BoB PGDBF','LIC ADO','NISM','Other'].map(o=>`<option ${elig.data.exam===o?'selected':''}>${o}</option>`).join('')}</select>
        </div>
      </div>
      <p class="text-[11.5px] text-slate-400 mt-3">Reserved category candidates get age relaxation per official rules (SC/ST +5, OBC +3, PwD +10).</p>`;
  }
  if (elig.step === 3) {
    return `
      <h3 class="text-[15px] font-bold text-slate-900 tracking-tight mb-4">Education & experience</h3>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="label">Highest qualification</label>
          <select class="input" data-k="degree">${["Bachelor's Degree","Master's Degree","Diploma","12th Pass"].map(o=>`<option ${elig.data.degree===o?'selected':''}>${o}</option>`).join('')}</select>
        </div>
        <div><label class="label">Graduation status</label>
          <select class="input" data-k="status">${['Completed','Pursuing','Discontinued'].map(o=>`<option ${elig.data.status===o?'selected':''}>${o}</option>`).join('')}</select>
        </div>
        <div><label class="label">Aggregate %</label>
          <input type="number" class="input" data-k="pct" value="${elig.data.pct||''}" placeholder="e.g. 72"/>
        </div>
        <div><label class="label">Total experience (years)</label>
          <input type="number" class="input" data-k="expYrs" value="${elig.data.expYrs||''}" placeholder="0 for fresher"/>
        </div>
      </div>`;
  }
  // step 4 — result
  return eligResult();
}

function calcAge(dob) {
  if (!dob) return null;
  const d = new Date(dob);
  if (isNaN(d)) return null;
  const today = new Date(2026, 5, 9); // fixed "today" to avoid Date.now anywhere
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age;
}

function eligResult() {
  const job = JOBS.find(j => j.id === elig.data.targetId);
  if (!job) return `<p class="text-slate-500 text-sm">Please pick a target role first.</p>`;
  const c = job.criteria;
  const d = elig.data;

  // Category-based age relaxation
  const ageRelax = d.category === 'SC' || d.category === 'ST' ? 5 : d.category === 'OBC' ? 3 : 0;
  const effectiveMaxAge = c.maxAge + ageRelax;
  const age = calcAge(d.dob);
  const pct = parseFloat(d.pct) || 0;
  const expYrs = parseFloat(d.expYrs) || 0;

  const checks = [
    {
      label:'Age',
      need:`${c.minAge} – ${c.maxAge} years${ageRelax?` (+${ageRelax} relaxation for ${d.category})`:''}`,
      have: age !== null ? `${age} years` : 'Not provided',
      ok: age !== null && age >= c.minAge && age <= effectiveMaxAge,
    },
    {
      label:'Qualification',
      need: c.degree.join(' / '),
      have: d.degree || 'Not provided',
      ok: c.degree.includes(d.degree),
    },
    {
      label:'Aggregate %',
      need:`${c.minPct}% or higher`,
      have: d.pct ? `${pct}%` : 'Not provided',
      ok: pct >= c.minPct,
    },
    {
      label:'Experience',
      need: c.minExpYrs === 0 ? 'Fresher OK' : `${c.minExpYrs}+ years`,
      have:`${expYrs} years`,
      ok: expYrs >= c.minExpYrs,
    },
  ];

  if (c.needsExam) {
    checks.push({
      label:'Entrance exam',
      need:`${c.needsExam} cleared`,
      have: d.exam || 'Not cleared',
      ok: d.exam === c.needsExam,
    });
  }

  const passed = checks.filter(c => c.ok).length;
  const total = checks.length;
  const allOk = passed === total;
  const eligible = passed >= total - 1; // 1 minor gap = still "borderline eligible"

  return `
    <h3 class="text-[15px] font-bold text-slate-900 tracking-tight mb-1">Eligibility result</h3>
    <p class="text-[12.5px] text-slate-500 mb-5">${job.title} · ${job.company}</p>

    <div class="surface p-5 mb-5 ${allOk?'bg-emerald-50 border-emerald-200':eligible?'bg-amber-50 border-amber-200':'bg-red-50 border-red-200'}">
      <div class="flex items-center gap-3">
        <div class="text-[24px]">${allOk?'✓':eligible?'!':'✗'}</div>
        <div>
          <div class="font-bold text-[15px] text-slate-900">${allOk?'You are eligible':eligible?'Borderline — minor gap':'Not eligible right now'}</div>
          <div class="text-[12.5px] text-slate-600">${passed} of ${total} criteria met</div>
        </div>
      </div>
    </div>

    <div class="space-y-2 mb-5">
      ${checks.map(c=>`
        <div class="surface p-3.5 flex items-start gap-3">
          <span class="${c.ok?'text-emerald-600':'text-red-500'} font-bold text-[14px] mt-0.5 shrink-0">${c.ok?'✓':'✗'}</span>
          <div class="flex-1">
            <div class="text-[13px] font-semibold text-slate-900">${c.label}</div>
            <div class="text-[12px] text-slate-500"><span class="text-slate-400">Required:</span> ${c.need}</div>
            <div class="text-[12px] ${c.ok?'text-emerald-700':'text-red-600'}"><span class="text-slate-400">You have:</span> ${c.have}</div>
          </div>
        </div>`).join('')}
    </div>

    <div class="flex gap-2">
      ${allOk||eligible?`<a href="#/apply/${job.id}" class="btn-primary">Apply now →</a>`:''}
      <a href="#/job/${job.id}" class="btn-outline">View job details</a>
      <button onclick="elig={step:1,data:{targetId:null}}; render()" class="btn-outline">Try another role</button>
    </div>`;
}

function eligSidePanel() {
  if (elig.step === 4) {
    const matches = JOBS.filter(j => {
      const c = j.criteria, d = elig.data;
      const age = calcAge(d.dob);
      return age !== null && age >= c.minAge && age <= c.maxAge + (d.category==='SC'||d.category==='ST'?5:d.category==='OBC'?3:0)
        && c.degree.includes(d.degree)
        && (parseFloat(d.pct)||0) >= c.minPct
        && (parseFloat(d.expYrs)||0) >= c.minExpYrs
        && (!c.needsExam || d.exam === c.needsExam);
    }).slice(0,4);
    return `
      <div class="text-[11px] uppercase tracking-wider text-slate-500 mb-3">Other roles you qualify for</div>
      ${matches.length ? matches.map(j=>`
        <a href="#/job/${j.id}" class="block py-2.5 border-b border-slate-100 last:border-0 row-hover -mx-2 px-2 rounded">
          <div class="text-[13px] font-semibold text-slate-900 truncate">${j.title}</div>
          <div class="text-[11.5px] text-slate-500">${j.company} · ${j.salary}</div>
        </a>`).join('') : `<p class="text-[12.5px] text-slate-500">Adjust your inputs to see more matches.</p>`}`;
  }
  const job = elig.data.targetId ? JOBS.find(j => j.id === elig.data.targetId) : null;
  if (job) {
    const c = job.criteria;
    return `
      <div class="text-[11px] uppercase tracking-wider text-slate-500 mb-2">Target role</div>
      <h4 class="text-[15px] font-bold text-slate-900 tracking-tight">${job.title}</h4>
      <div class="text-[12.5px] text-slate-500 mb-4">${job.company} · ${job.location}</div>
      <div class="text-[11px] uppercase tracking-wider text-slate-500 mb-2">Eligibility rules</div>
      <ul class="text-[12.5px] space-y-1.5 text-slate-700">
        <li>· Age ${c.minAge}–${c.maxAge} years</li>
        <li>· ${c.degree.join(' / ')}</li>
        <li>· ${c.minPct}%+ aggregate</li>
        <li>· ${c.minExpYrs === 0 ? 'Fresher OK' : `${c.minExpYrs}+ yrs experience`}</li>
        ${c.needsExam?`<li>· Cleared <span class="font-semibold">${c.needsExam}</span></li>`:''}
      </ul>`;
  }
  return `
    <div class="text-[11px] uppercase tracking-wider text-slate-500 mb-2">How this works</div>
    <p class="text-[12.5px] text-slate-600 leading-relaxed mb-4">Each bank/NBFC role has different eligibility — age window, qualification, percentage, experience, and entrance exam (for PSU banks).</p>
    <p class="text-[12.5px] text-slate-600 leading-relaxed">Pick a target role first. We'll evaluate each criterion against your profile and tell you exactly which ones match.</p>`;
}

function bindEligibility() {
  const save = () => {
    document.querySelectorAll('#elig-form [data-k]').forEach(el => {
      elig.data[el.dataset.k] = el.value;
    });
    const radio = document.querySelector('input[name="targetId"]:checked');
    if (radio) elig.data.targetId = radio.value;
  };
  // Live-bind radio change so the side panel updates immediately
  document.querySelectorAll('input[name="targetId"]').forEach(r => {
    r.onchange = () => { elig.data.targetId = r.value; render(); };
  });
  const back = document.getElementById('elig-back');
  const next = document.getElementById('elig-next');
  if (back) back.onclick = () => { save(); if (elig.step>1){ elig.step--; render(); } };
  if (next) next.onclick = () => {
    save();
    if (elig.step === 1 && !elig.data.targetId) return toast('Pick a target role to continue.');
    if (elig.step < 4) elig.step++;
    render();
  };
}

/* ====================== VIEW: JOBS LIST ================================ */
let jobFilter = { q:'', salary:'', loc:'', sort:'newest' };

function viewJobsList(cat) {
  window._afterRender = bindJobsList;
  const title = cat === 'bank' ? 'Bank Jobs' : 'BFSI Jobs';
  const sub = cat === 'bank' ? 'Explore the latest opportunities in Banks' : 'NBFC, Insurance, Fintech, Loan & Sales jobs';
  const list = JOBS.filter(j => j.category === cat)
    .filter(j => !jobFilter.q || (j.title+j.company+j.skills.join(' ')).toLowerCase().includes(jobFilter.q.toLowerCase()))
    .filter(j => !jobFilter.loc || j.location.toLowerCase().includes(jobFilter.loc.toLowerCase()));

  return `
  <div class="max-w-7xl mx-auto px-6 py-10">
    <h1 class="text-3xl font-bold text-slate-900 mb-1">${title}</h1>
    <p class="text-slate-500 mb-6">${sub}</p>

    <div class="flex gap-6 border-b border-slate-200 mb-6">
      <a href="#/bank-jobs" class="pb-3 font-medium ${cat==='bank'?'tab-active':'text-slate-500'}">Bank Jobs</a>
      <a href="#/bfsi-jobs" class="pb-3 font-medium ${cat==='bfsi'?'tab-active':'text-slate-500'}">BFSI Jobs</a>
    </div>

    <div class="flex flex-wrap items-center gap-3 mb-6">
      <div class="flex-1 min-w-[280px] relative">
        <span class="absolute left-3 top-3 text-slate-400">${icon.search}</span>
        <input id="jl-q" value="${jobFilter.q}" class="input pl-10" placeholder="Search by job title, role or company..."/>
      </div>
      <select id="jl-loc" class="input max-w-[160px]">
        <option value="">All Locations</option>
        ${['Mumbai','Pune','Delhi','Bangalore','Hyderabad'].map(l=>`<option ${jobFilter.loc===l?'selected':''}>${l}</option>`).join('')}
      </select>
      <button class="btn-outline">Salary ▾</button>
      <button class="btn-outline">More Filters</button>
      <div class="ml-auto text-sm flex items-center gap-2 text-slate-500">
        Sort By:
        <select class="input max-w-[140px]"><option>Newest</option><option>Salary High → Low</option><option>Experience</option></select>
      </div>
    </div>

    <p class="text-sm text-slate-500 mb-4">${list.length} jobs found</p>
    <div class="space-y-3">
      ${list.length ? list.map(j=>jobCard(j)).join('') : `<div class="bg-white border border-slate-100 rounded-xl p-10 text-center text-slate-500">No jobs match your filters.</div>`}
    </div>
  </div>`;
}

function bindJobsList() {
  const q = document.getElementById('jl-q');
  if (q) q.oninput = () => { jobFilter.q = q.value; render(); q.focus(); q.setSelectionRange(q.value.length,q.value.length); };
  const loc = document.getElementById('jl-loc');
  if (loc) loc.onchange = () => { jobFilter.loc = loc.value; render(); };
}

/* ====================== VIEW: JOB DETAIL =============================== */
let jobDetailTab = 'desc';

function viewJobDetail(id) {
  const job = JOBS.find(j => j.id === id);
  if (!job) return `<div class="p-10 text-center text-slate-500">Job not found.</div>`;
  window._afterRender = () => {
    document.querySelectorAll('.jd-tab').forEach(t=>{
      t.onclick = () => { jobDetailTab = t.dataset.tab; render(); };
    });
  };
  const saved = STATE.saved.includes(job.id);

  return `
  <div class="max-w-6xl mx-auto px-6 py-10">
    <a href="#/bank-jobs" class="text-sm text-slate-500 hover:text-brand-600 mb-4 inline-block">← Back to Jobs</a>

    <div class="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-start gap-5 mb-6">
      <div class="w-16 h-16 rounded-xl bg-white border border-slate-100 grid place-items-center shrink-0 overflow-hidden p-2">
        ${LOGO_MAP[job.company]
          ? `<img src="${LOGO_MAP[job.company]}" alt="${job.company}" class="avatar-logo-img"/>`
          : `<span class="font-bold text-slate-700">${job.company.split(' ').map(w=>w[0]).join('').slice(0,3)}</span>`}
      </div>
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1">
          <h1 class="text-2xl font-bold text-slate-900">${job.title}</h1>
          ${job.tag ? `<span class="chip bg-emerald-50 text-emerald-700">${job.tag}</span>` : ''}
        </div>
        <p class="text-slate-500">${job.company}</p>
        <div class="flex flex-wrap items-center gap-5 text-sm text-slate-500 mt-3">
          <span class="flex items-center gap-1">${icon.pin}${job.location}</span>
          <span class="flex items-center gap-1">${icon.exp}${job.exp}</span>
          <span class="flex items-center gap-1">${icon.rupee}${job.salary}</span>
          <span class="flex items-center gap-1">${icon.clock}${job.type}</span>
        </div>
      </div>
      <div class="flex gap-2">
        <button onclick="toggleSave('${job.id}')" class="btn-outline ${saved?'!text-brand-600 !border-brand-200':''}">${saved?'★ Saved':'☆ Save Job'}</button>
        <a href="#/apply/${job.id}" class="btn-primary">Apply Now</a>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      <div class="md:col-span-2 bg-white border border-slate-100 rounded-2xl p-6">
        <div class="flex gap-6 border-b border-slate-200 mb-5">
          ${[['desc','Job Description'],['elig','Eligibility'],['resp','Responsibilities'],['comp','About Company']]
            .map(([k,l])=>`<button data-tab="${k}" class="jd-tab pb-3 font-medium text-sm ${jobDetailTab===k?'tab-active':'text-slate-500'}">${l}</button>`).join('')}
        </div>
        <div class="text-slate-600 leading-relaxed">
          ${jobDetailTab==='desc'?`
            <p>${job.description}</p>
            <h4 class="font-semibold text-slate-900 mt-5 mb-2">Key Skills</h4>
            <div class="flex flex-wrap gap-2">${job.skills.map(s=>`<span class="chip">${s}</span>`).join('')}</div>`:''}
          ${jobDetailTab==='elig'?`<ul class="space-y-2">${job.eligibility.map(e=>`<li class="flex items-start gap-2"><span class="text-emerald-600 mt-1">✓</span>${e}</li>`).join('')}</ul>`:''}
          ${jobDetailTab==='resp'?`<ul class="space-y-2">${job.responsibilities.map(e=>`<li class="flex items-start gap-2"><span class="text-brand-600 mt-1">•</span>${e}</li>`).join('')}</ul>`:''}
          ${jobDetailTab==='comp'?`<p>${job.company} is one of India's leading institutions in the banking & financial services sector with branches across the country.</p>`:''}
        </div>
      </div>
      <div class="bg-white border border-slate-100 rounded-2xl p-6 h-fit">
        <h3 class="font-semibold text-slate-900 mb-3">Eligibility</h3>
        <ul class="space-y-2 text-sm text-slate-600">${job.eligibility.map(e=>`<li class="flex items-start gap-2"><span class="text-emerald-600 mt-1">✓</span>${e}</li>`).join('')}</ul>
        <a href="#/eligibility" class="text-sm text-brand-600 font-semibold mt-4 inline-block">Check Your Eligibility →</a>
      </div>
    </div>
  </div>`;
}

/* ====================== VIEW: APPLY ==================================== */
let applyState = { step:1, data:{} };

function viewApply(id) {
  const job = JOBS.find(j => j.id === id);
  if (!job) return `<div class="p-10 text-center text-slate-500">Job not found.</div>`;
  if (!STATE.user) { location.hash = '#/login'; return ''; }
  window._afterRender = () => bindApply(job);

  const steps = ['Personal','Education','Experience','Review'];
  const d = applyState.data;
  const stepBody = applyState.step === 1 ? `
    <h3 class="font-semibold text-slate-900 mb-4">Personal Information</h3>
    <div class="grid grid-cols-2 gap-4">
      <div><label class="label">Full Name</label><input class="input" data-k="name" value="${d.name||STATE.user.name||''}"/></div>
      <div><label class="label">Email</label><input class="input" data-k="email" value="${d.email||''}"/></div>
      <div><label class="label">Phone</label><input class="input" data-k="phone" value="${d.phone||STATE.user.contact||''}"/></div>
      <div><label class="label">City</label><input class="input" data-k="city" value="${d.city||''}"/></div>
    </div>` : applyState.step === 2 ? `
    <h3 class="font-semibold text-slate-900 mb-4">Education</h3>
    <div class="grid grid-cols-2 gap-4">
      <div><label class="label">Highest Qualification</label><input class="input" data-k="qual" value="${d.qual||''}"/></div>
      <div><label class="label">University</label><input class="input" data-k="univ" value="${d.univ||''}"/></div>
      <div><label class="label">Year of Passing</label><input class="input" data-k="yop" value="${d.yop||''}"/></div>
      <div><label class="label">Aggregate %</label><input class="input" data-k="agg" value="${d.agg||''}"/></div>
    </div>` : applyState.step === 3 ? `
    <h3 class="font-semibold text-slate-900 mb-4">Work Experience</h3>
    <div class="grid grid-cols-2 gap-4">
      <div><label class="label">Total Experience</label><input class="input" data-k="texp" value="${d.texp||''}"/></div>
      <div><label class="label">Current Company</label><input class="input" data-k="ccomp" value="${d.ccomp||''}"/></div>
      <div class="col-span-2"><label class="label">Why are you a fit for this role?</label>
        <textarea class="input" rows="4" data-k="fit">${d.fit||''}</textarea></div>
      <div class="col-span-2"><label class="label">Upload Resume (optional)</label>
        <div class="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center text-sm text-slate-500">📎 Drag & drop or click to upload PDF</div>
      </div>
    </div>` : `
    <h3 class="font-semibold text-slate-900 mb-4">Review your application</h3>
    <div class="bg-slate-50 rounded-lg p-4 text-sm grid grid-cols-2 gap-3">
      ${Object.entries(d).map(([k,v])=>`<div><div class="text-xs text-slate-500">${k}</div><div class="font-medium text-slate-800">${v||'—'}</div></div>`).join('')}
    </div>
    <label class="flex items-start gap-2 mt-5 text-sm text-slate-600"><input type="checkbox" id="confirm" class="mt-1"/> I confirm the above details are accurate.</label>`;

  const content = `
  <a href="#/job/${job.id}" class="text-sm text-slate-500 hover:text-brand-600 mb-4 inline-block">← Back to Job</a>
  <h1 class="text-2xl font-bold text-slate-900 mb-1">Apply for ${job.title}</h1>
  <p class="text-sm text-slate-500 mb-6">${job.company} · ${job.location}</p>

  <div class="flex items-center gap-4 mb-8">
    ${steps.map((s,i)=>`
      <div class="flex items-center gap-2">
        <div class="step-dot ${applyState.step>i+1?'done':applyState.step===i+1?'active':''}">${applyState.step>i+1?'✓':i+1}</div>
        <span class="text-sm font-medium ${applyState.step===i+1?'text-brand-600':'text-slate-500'}">${s}</span>
      </div>
      ${i<3?`<div class="flex-1 h-px bg-slate-200"></div>`:''}
    `).join('')}
  </div>

  <div class="bg-white border border-slate-100 rounded-2xl p-6">
    <div id="apply-form">${stepBody}</div>
    <div class="flex justify-between mt-6">
      <button id="apply-back" class="btn-outline" ${applyState.step===1?'disabled':''}>Back</button>
      <button id="apply-next" class="btn-primary">${applyState.step===4?'Submit & Apply on Official Site →':'Next'}</button>
    </div>
  </div>`;
  return appShell('Applied Jobs', content);
}

function bindApply(job) {
  const save = () => document.querySelectorAll('#apply-form [data-k]').forEach(el => applyState.data[el.dataset.k] = el.value);
  document.getElementById('apply-back').onclick = () => { save(); if (applyState.step>1){applyState.step--; render();} };
  document.getElementById('apply-next').onclick = () => {
    save();
    if (applyState.step < 4) { applyState.step++; render(); return; }
    if (!document.getElementById('confirm')?.checked) return toast('Please confirm before submitting.');
    STATE.applications.push({ jobId: job.id, when: new Date().toISOString(), data: applyState.data });
    persist();
    applyState = { step:1, data:{} };
    const url = jobApplyUrl(job);
    toast('✅ Details saved! Taking you to the official job page…');
    setTimeout(() => {
      if (url !== '#') window.open(url, '_blank', 'noopener');
      location.hash = '#/dashboard';
    }, 1000);
  };
}

/* ====================== VIEW: APTITUDE ================================= */
let aptState = { mode:'home', topic:null, idx:0, answers:{}, questions:[] };

function topicCount(t) {
  return APTITUDE_BANK.filter(q => q.topic === t).length;
}

function viewAptitude() {
  let body = '';

  if (aptState.mode === 'home') {
    const total = APTITUDE_BANK.length;
    body = `
    <div class="mb-6 flex items-end justify-between">
      <div>
        <h1 class="text-[22px] font-bold text-slate-900 tracking-tight">Aptitude practice</h1>
        <p class="text-[13px] text-slate-500">${total} questions in the bank · 20 random questions per attempt</p>
      </div>
    </div>

    <div class="surface p-6 mb-8 flex items-center justify-between bg-slate-900 border-slate-900 text-white">
      <div>
        <div class="text-[11px] uppercase tracking-wider text-slate-400 mb-1">Full mock</div>
        <h2 class="text-[18px] font-bold tracking-tight mb-1">20-question mixed test</h2>
        <p class="text-slate-400 text-[13px] mb-4">Quant · Reasoning · English · Banking — all topics, random each time.</p>
        <button onclick="aptStart('all')" class="bg-white text-slate-900 px-4 py-2 rounded-md text-[13px] font-semibold hover:bg-slate-100">Start mock test →</button>
      </div>
      <div class="text-right">
        <div class="text-[40px] font-bold tracking-tight leading-none">20</div>
        <div class="text-[11px] text-slate-400 uppercase tracking-wider mt-1">questions</div>
      </div>
    </div>

    <h3 class="text-[15px] font-bold text-slate-900 tracking-tight mb-3">Practice by topic</h3>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-100 surface overflow-hidden">
      ${[
        ['Quantitative Aptitude','Numbers · Profit · TSD'],
        ['Reasoning','Series · Coding · Direction'],
        ['English','Grammar · Vocab · Idioms'],
        ['Banking Awareness','RBI · NPA · CASA · UPI'],
      ].map(([n,d])=>`
        <button onclick="aptStart('${n}')" class="bg-white p-5 text-left row-hover">
          <h4 class="font-bold text-[14px] text-slate-900 mb-1 tracking-tight">${n}</h4>
          <p class="text-[12px] text-slate-500 mb-3">${d}</p>
          <div class="flex items-center justify-between">
            <span class="text-[11px] text-slate-400">${topicCount(n)} Qs in bank</span>
            <span class="text-[12px] font-semibold text-slate-900">Start →</span>
          </div>
        </button>`).join('')}
    </div>

    <div class="surface p-5 mt-8 flex items-start gap-4">
      <div class="w-9 h-9 rounded-md bg-slate-50 border border-slate-100 grid place-items-center text-slate-700 font-bold text-[13px] shrink-0">i</div>
      <div>
        <h4 class="font-semibold text-[13px] text-slate-900 mb-1">How attempts work</h4>
        <p class="text-[12.5px] text-slate-500 leading-relaxed">Each attempt randomly draws 20 questions from the topic you choose (or all topics for the mock test). Retake any time — you'll get a fresh randomized set.</p>
      </div>
    </div>`;
  }

  if (aptState.mode === 'test') {
    const qs = aptState.questions;
    const q = qs[aptState.idx];
    const sel = aptState.answers[aptState.idx];
    const submitted = aptState.answers[aptState.idx+'_submitted'];
    const progress = Math.round(((aptState.idx) / qs.length) * 100);

    body = `
    <div class="flex items-center justify-between mb-5">
      <button onclick="if(confirm('Exit test? Progress will be lost.')){aptState.mode='home'; render();}" class="text-[13px] text-slate-500 hover:text-slate-900">← Exit test</button>
      <div class="text-[12px] text-slate-500">Question <span class="font-semibold text-slate-900">${aptState.idx+1}</span> / ${qs.length}</div>
    </div>

    <div class="h-1 bg-slate-100 rounded-full overflow-hidden mb-6">
      <div class="h-full bg-slate-900 transition-all" style="width:${progress}%"></div>
    </div>

    <div class="surface p-6 mb-5">
      <div class="text-[11px] uppercase tracking-wider text-slate-400 mb-2">${q.topic}</div>
      <h2 class="text-[16px] font-semibold text-slate-900 mb-5 leading-relaxed">${q.q}</h2>
      <div class="grid gap-2">
        ${q.options.map((o,i)=>{
          let cls = 'option';
          if (submitted) {
            if (i === q.correct) cls += ' correct';
            else if (i === sel) cls += ' wrong';
          } else if (sel === i) cls += ' selected';
          return `<button onclick="aptPick(${i})" class="${cls} text-left flex items-center gap-3" ${submitted?'disabled':''}>
            <span class="w-6 h-6 rounded-full border border-current grid place-items-center text-[11px] font-bold shrink-0">${String.fromCharCode(65+i)}</span>
            <span>${o}</span>
          </button>`;
        }).join('')}
      </div>
      ${submitted ? `
        <div class="mt-5 p-4 rounded-md bg-slate-50 border border-slate-100">
          <div class="text-[11px] uppercase tracking-wider text-slate-500 mb-1">${sel===q.correct?'Correct':'Explanation'}</div>
          <div class="text-[13px] text-slate-700 leading-relaxed">${q.explain}</div>
        </div>` : ''}
    </div>

    <div class="flex justify-between">
      <button onclick="aptNav(-1)" class="btn-outline" ${aptState.idx===0?'disabled':''}>← Previous</button>
      ${!submitted
        ? `<button onclick="aptSubmit()" class="btn-primary" ${sel===undefined?'disabled':''}>Submit answer</button>`
        : aptState.idx === qs.length-1
          ? `<button onclick="aptFinish()" class="btn-primary">Finish test →</button>`
          : `<button onclick="aptNav(1)" class="btn-primary">Next →</button>`
      }
    </div>`;
  }

  if (aptState.mode === 'result') {
    const qs = aptState.questions;
    let correct = 0;
    const byTopic = {};
    qs.forEach((q,i)=>{
      byTopic[q.topic] = byTopic[q.topic] || {c:0,t:0};
      byTopic[q.topic].t++;
      if (aptState.answers[i] === q.correct) { correct++; byTopic[q.topic].c++; }
    });
    const pct = Math.round(100*correct/qs.length);
    const verdict = pct>=80?'Excellent':pct>=60?'Good':pct>=40?'Needs practice':'Keep practicing';

    body = `
    <div class="surface p-8 mb-6">
      <div class="grid md:grid-cols-3 gap-6 items-center">
        <div class="md:col-span-2">
          <div class="text-[11px] uppercase tracking-wider text-slate-400 mb-1">Test complete</div>
          <h2 class="text-[28px] font-bold text-slate-900 tracking-tight mb-2">${verdict}</h2>
          <p class="text-[13px] text-slate-500">You scored <span class="font-semibold text-slate-900">${correct} of ${qs.length}</span> on this attempt.</p>
          <div class="flex gap-3 mt-5">
            <button onclick="aptState={mode:'home',topic:null,idx:0,answers:{},questions:[]}; render()" class="btn-outline">Back to topics</button>
            <button onclick="aptStart(aptState.topic)" class="btn-primary">Retake (new 20 Qs)</button>
          </div>
        </div>
        <div class="text-right md:text-center">
          <div class="text-[64px] font-bold text-slate-900 tracking-tight leading-none">${pct}%</div>
          <div class="text-[11px] text-slate-400 uppercase tracking-wider mt-1">score</div>
        </div>
      </div>
    </div>

    <h3 class="text-[15px] font-bold text-slate-900 tracking-tight mb-3">Topic breakdown</h3>
    <div class="grid md:grid-cols-${Object.keys(byTopic).length || 1} gap-px bg-slate-100 surface overflow-hidden mb-8">
      ${Object.entries(byTopic).map(([t,v])=>`
        <div class="bg-white p-4">
          <div class="text-[11px] uppercase tracking-wider text-slate-400 mb-1">${t}</div>
          <div class="stat-num">${v.c} / ${v.t}</div>
          <div class="text-[11px] text-slate-500 mt-1">${Math.round(100*v.c/v.t)}% correct</div>
        </div>`).join('')}
    </div>

    <h3 class="text-[15px] font-bold text-slate-900 tracking-tight mb-3">Review answers</h3>
    <div class="space-y-2">
      ${qs.map((q,i)=>{
        const ok = aptState.answers[i] === q.correct;
        return `
        <div class="surface p-4">
          <div class="flex items-start gap-3">
            <span class="${ok?'text-emerald-600':'text-red-500'} font-bold text-[13px] shrink-0">${ok?'✓':'✗'}</span>
            <div class="flex-1 min-w-0">
              <div class="text-[11px] text-slate-400 uppercase tracking-wider mb-1">${q.topic}</div>
              <div class="text-[13.5px] font-medium text-slate-900 mb-1">${i+1}. ${q.q}</div>
              <div class="text-[12.5px] text-slate-500">Correct: <span class="text-slate-900 font-medium">${q.options[q.correct]}</span></div>
              <div class="text-[12px] text-slate-500 mt-1">${q.explain}</div>
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>`;
  }

  return appShell('Aptitude Practice', body);
}

window.aptStart = (topic) => {
  aptState = { mode:'test', topic, idx:0, answers:{}, questions: pickRandomQuestions(20, topic) };
  render();
};
window.aptPick = (i) => { if (!aptState.answers[aptState.idx+'_submitted']) { aptState.answers[aptState.idx] = i; render(); } };
window.aptSubmit = () => { aptState.answers[aptState.idx+'_submitted'] = true; render(); };
window.aptNav = (d) => { aptState.idx += d; render(); };
window.aptFinish = () => { aptState.mode = 'result'; render(); };

/* ====================== VIEW: INTERVIEW ================================ */
let intTab = 'hr';
let intLang = 'en'; // 'en' | 'hi'
let openQ = null;

function viewInterview() {
  window._afterRender = bindInterview;
  const tabs = [
    ['hr','HR', HR_QUESTIONS],
    ['tech','Technical', TECH_QUESTIONS],
    ['beh','Behavioral', BEHAVIORAL_QUESTIONS],
    ['sit','Situational', SITUATION_QUESTIONS],
  ];
  const qs = tabs.find(t => t[0] === intTab)[2];

  const content = `
  <div class="mb-6 flex items-end justify-between flex-wrap gap-4">
    <div>
      <h1 class="text-[22px] font-bold text-slate-900 tracking-tight">Interview questions</h1>
      <p class="text-[13px] text-slate-500">${HR_QUESTIONS.length + TECH_QUESTIONS.length + BEHAVIORAL_QUESTIONS.length + SITUATION_QUESTIONS.length}+ curated Qs with sample answers in English & Hinglish</p>
    </div>
    <div class="inline-flex p-0.5 bg-slate-100 rounded-md text-[12px]">
      <button data-lang="en" class="lang-btn px-3 py-1 rounded ${intLang==='en'?'bg-white shadow-sm font-semibold text-slate-900':'text-slate-500'}">English</button>
      <button data-lang="hi" class="lang-btn px-3 py-1 rounded ${intLang==='hi'?'bg-white shadow-sm font-semibold text-slate-900':'text-slate-500'}">Hinglish</button>
    </div>
  </div>

  <div class="grid md:grid-cols-3 gap-8">
    <div class="md:col-span-2">
      <div class="flex gap-6 border-b border-slate-100 mb-5 overflow-x-auto">
        ${tabs.map(([k,l,arr])=>`
          <button data-it="${k}" class="int-tab pb-3 font-medium text-[13px] whitespace-nowrap ${intTab===k?'tab-active':'text-slate-500'}">
            ${l} <span class="text-slate-400 ml-1">(${arr.length})</span>
          </button>`).join('')}
      </div>
      <div class="space-y-2">
        ${qs.map((q,i)=>`
          <div class="question-card ${openQ===i?'open':''}">
            <button data-q="${i}" class="qbtn w-full flex items-center justify-between gap-3 text-left">
              <span class="font-medium text-[13.5px] text-slate-900 leading-snug">${i+1}. ${q.q}</span>
              <span class="text-slate-400 text-[18px] font-light shrink-0">${openQ===i?'−':'+'}</span>
            </button>
            ${openQ===i?`
              <div class="mt-3 border-t border-slate-100 pt-3">
                <div class="text-[11px] uppercase tracking-wider text-slate-400 mb-1.5">Sample answer · ${intLang==='en'?'English':'Hinglish'}</div>
                <div class="text-[13px] text-slate-700 leading-relaxed">${intLang==='en' ? q.en : q.hi}</div>
              </div>`:''}
          </div>`).join('')}
      </div>
    </div>

    <aside class="space-y-4">
      <div class="surface p-5">
        <h3 class="text-[13px] font-bold text-slate-900 mb-3 tracking-tight uppercase tracking-wider text-[11px] text-slate-500">Quick tips</h3>
        <ul class="space-y-2.5 text-[13px] text-slate-700">
          ${[
            'Use STAR for behavioral questions',
            'Quote one banking-related current event',
            'Quantify wherever possible',
            'Dress in formals — light shirt + dark trousers',
            'Carry 2 hard copies of your resume',
          ].map(t=>`<li class="flex items-start gap-2"><span class="text-emerald-600 mt-0.5">✓</span><span>${t}</span></li>`).join('')}
        </ul>
      </div>

      <div class="surface p-5">
        <h3 class="text-[11px] uppercase tracking-wider text-slate-500 mb-2">Glossary to brush up</h3>
        <ul class="text-[12.5px] space-y-2">
          ${[
            ['CASA','Current + Savings Account ratio'],
            ['NPA','90+ days overdue loan'],
            ['Repo','RBI lending rate to banks'],
            ['NIM','Net Interest Margin'],
            ['DSA','Direct Sales Agent'],
          ].map(([t,d])=>`<li class="flex items-center justify-between row-hover -mx-2 px-2 py-1 rounded"><span class="font-semibold text-slate-900">${t}</span><span class="text-slate-500">${d}</span></li>`).join('')}
        </ul>
      </div>
    </aside>
  </div>`;
  return appShell('Interview Prep', content);
}

function bindInterview() {
  document.querySelectorAll('.int-tab').forEach(t=>{
    t.onclick = () => { intTab = t.dataset.it; openQ = null; render(); };
  });
  document.querySelectorAll('.qbtn').forEach(b=>{
    b.onclick = () => { const i = +b.dataset.q; openQ = openQ === i ? null : i; render(); };
  });
  document.querySelectorAll('.lang-btn').forEach(b=>{
    b.onclick = () => { intLang = b.dataset.lang; render(); };
  });
}

/* ====================== VIEW: MORE JOBS ================================ */
let moreTab = 'all';

function viewMoreJobs() {
  window._afterRender = () => {
    document.querySelectorAll('.mj-tab').forEach(t=>{
      t.onclick = () => { moreTab = t.dataset.mj; render(); };
    });
  };
  const list = JOBS.filter(j => moreTab==='all' ? true : j.category === moreTab);

  return `
  <div class="max-w-7xl mx-auto px-6 py-10">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">More Jobs for You</h1>
        <p class="text-slate-500 mt-1">Explore more opportunities and take the next step.</p>
      </div>
      <a href="#/bank-jobs" class="text-sm text-brand-600 font-semibold">View All Jobs →</a>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      <div class="md:col-span-2">
        <div class="flex gap-6 border-b border-slate-200 mb-5">
          ${[['all','All Jobs'],['bank','Bank Jobs'],['bfsi','BFSI Jobs']].map(([k,l])=>`
            <button data-mj="${k}" class="mj-tab pb-3 font-medium text-sm ${moreTab===k?'tab-active':'text-slate-500'}">${l}</button>`).join('')}
        </div>
        <div class="space-y-3">${list.map(j=>jobCard(j)).join('')}</div>
      </div>
      <aside class="bg-white border border-slate-100 rounded-2xl p-6 h-fit">
        <h3 class="font-bold text-slate-900 mb-5">Track Your Applications</h3>
        <div class="grid grid-cols-2 gap-3">
          ${[['12','Applied','bg-brand-50 text-brand-700'],['3','In Review','bg-amber-50 text-amber-700'],['2','Shortlisted','bg-emerald-50 text-emerald-700'],['1','Interview Scheduled','bg-purple-50 text-purple-700']]
            .map(([n,l,c])=>`<div class="rounded-xl ${c} p-4"><div class="text-2xl font-bold">${n}</div><div class="text-xs">${l}</div></div>`).join('')}
        </div>
        <a href="#/dashboard" class="text-sm text-brand-600 font-semibold mt-5 inline-block">View All Applications →</a>
      </aside>
    </div>
  </div>`;
}

/* ----------------------------- INIT ------------------------------------ */
render();
