import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../services/i18n';
import { PreparedDraft } from '../types';
import {
  FileText,
  AlertTriangle,
  Copy,
  Download,
  Save,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export const ComplaintAssistantPage: React.FC = () => {
  const { preferences, saveDraft, navigate } = useApp();
  const t = getTranslation(preferences.language);

  const [templateType, setTemplateType] = useState<PreparedDraft['template_type']>('consumer_grievance');
  const [applicantName, setApplicantName] = useState('');
  const [recipient, setRecipient] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [amountLoss, setAmountLoss] = useState('');
  const [factSummary, setFactSummary] = useState('');
  const [generatedDraft, setGeneratedDraft] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const generateDraft = (e: React.FormEvent) => {
    e.preventDefault();

    const name = applicantName.trim() || '[YOUR FULL NAME]';
    const rec = recipient.trim() || '[DESIGNATED OFFICIAL / COMPANY NAME]';
    const date = incidentDate.trim() || '[DATE OF OCCURRENCE]';
    const amount = amountLoss.trim() ? `INR ${amountLoss.trim()}` : '[AMOUNT INVOLVED, IF ANY]';
    const facts = factSummary.trim() || '[DETAILED FACTUAL SUMMARY OF INCIDENT]';

    let draft = '';

    if (templateType === 'consumer_grievance') {
      draft = `BEFORE THE APPROPRIATE FORUM / GRIEVANCE REDRESSAL OFFICER
TO:
${rec}
Address: [OFFICIAL REGISTERED ADDRESS]

SUBJECT: FORMAL COMPLAINT AND DEMAND FOR REFUND/RECTIFICATION REGARDING DEFICIENCY OF SERVICE / DEFECTIVE PRODUCT UNDER THE CONSUMER PROTECTION ACT, 2019

Sir/Madam,

I, ${name}, resident of Kota, Rajasthan / [YOUR ADDRESS], state as follows:

1. STATEMENT OF FACTS (USER-REPORTED):
   - On ${date}, I availed the service / purchased goods from your establishment.
   - Transaction Reference / Invoice Number: [INSERT BILL / INVOICE NUMBER].
   - Monetary Consideration Paid: ${amount}.
   - Description of Defect / Grievance:
     ${facts}

2. STATUTORY PROTECTIONS & NOTICE:
   - Under Section 2(7) and Section 35 of the Consumer Protection Act, 2019, every consumer is entitled to goods and services free from defect, deficiency, or misleading representations.
   - Despite prior intimations, the deficiency has not been addressed, causing monetary loss and harassment.

3. RELIEF SOUGHT:
   - Immediate full refund of the amount of ${amount} along with statutory interest.
   - Or, immediate replacement / rectification of the deficient service within 7 days.

Failing an amicable resolution within 7 calendar days of receipt of this notice, I reserve the lawful right to lodge a formal grievance before the National Consumer Helpline (1915) and file a statutory consumer case via E-Daakhil before the District Consumer Disputes Redressal Commission, Kota.

Date: ${new Date().toLocaleDateString()}
Place: Kota, Rajasthan

Yours sincerely,

_________________________
${name}
Contact: [PHONE NUMBER]
Email: [EMAIL ADDRESS]

[ATTACHMENTS ENCLOSED]:
1. Copy of Invoice / Payment Receipt
2. Copy of previous communications / WhatsApp / Email
3. Proof of deficiency (Photographs / Screenshots)`;
    } else if (templateType === 'cyber_fraud_intimation') {
      draft = `URGENT NOTICE OF UNAUTHORIZED TRANSACTION & REQUEST TO FREEZE / REVERSE FUNDS
TO:
The Nodal Officer / Fraud Monitoring Cell
${rec || '[BANK / PAYMENT GATEWAY NAME]'}

CC: National Cyber Crime Reporting Portal (NCRP - Helpline 1930)

SUBJECT: URGENT REPORT OF CYBER FINANCIAL FRAUD - REQUEST FOR IMMEDIATE LIEN / FREEZE UNDER SECTION 66D IT ACT & RBI CIRCULAR ON CUSTOMER LIABILITY

Sir/Madam,

I, ${name}, holding Account/Card/UPI ID: [INSERT ACCOUNT NUMBER / UPI ID], urgently report an unauthorized fraudulent transaction:

1. TRANSACTION DETAILS:
   - Date & Time of Fraud: ${date}
   - Amount Debited: ${amount}
   - Fraudulent Transaction Reference / UTR Number: [INSERT UTR NUMBER]
   - Beneficiary Account / VPA / Mobile: [INSERT FRAUDSTER DETAILS IF KNOWN]

2. FACTUAL REPORT:
   ${facts}
   - I have neither authorized this transaction nor shared my OTP / PIN intentionally with anyone.
   - Under RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18, where zero customer liability is established, the bank must credit the disputed amount within 10 working days.

3. IMMEDIATE ACTION REQUIRED:
   - Please immediately mark a lien on the beneficiary account to prevent cash withdrawal.
   - Please provide the bank's internal fraud ticket number for police records.

NCRP Acknowledgement Number: [INSERT 1930 TICKET NUMBER IF REGISTERED]

Date: ${new Date().toLocaleDateString()}
Yours faithfully,

${name}
Mobile: [YOUR NUMBER]`;
    } else if (templateType === 'police_representation') {
      draft = `TO:
The Station House Officer (SHO)
Police Station: ${rec || '[NAME OF POLICE STATION, E.G. NAYAPURA, KOTA]'}
District: Kota, Rajasthan

SUBJECT: WRITTEN COMPLAINT / INTIMATION REGARDING COMMISSION OF COGNIZABLE / NON-COGNIZABLE OFFENCE

Sir,

I, ${name}, son/daughter/wife of [FATHER/SPOUSE NAME], residing at [RESIDENTIAL ADDRESS, KOTA], submit this complaint:

1. PARTICULARS OF INCIDENT:
   - Date and Time of Incident: ${date}
   - Place of Occurrence: [EXACT LOCATION IN KOTA]
   - Persons Involved / Accused: [NAME / UNKNOWN / DESCRIPTION]

2. STATEMENT OF FACTS:
   ${facts}

3. REQUEST:
   - I request you to kindly record this complaint in the General Diary (GD) of the police station.
   - If a cognizable offence is disclosed, register an FIR under relevant provisions and supply me a free copy of the FIR as mandated under Section 154 CrPC / Section 173 BNSS.
   - If non-cognizable, provide a signed acknowledgement with GD Entry number.

Date: ${new Date().toLocaleDateString()}
Complainant's Signature: _________________________
Name: ${name}
Phone: [CONTACT NUMBER]`;
    } else {
      // RTI Application
      draft = `FORM 'A' - APPLICATION FOR OBTAINING INFORMATION UNDER SECTION 6(1) OF THE RIGHT TO INFORMATION ACT, 2005

TO:
The Central / State Public Information Officer (CPIO / SPIO)
Office of: ${rec || '[PUBLIC AUTHORITY / DEPARTMENT NAME, KOTA, RAJASTHAN]'}

1. Full Name of Applicant: ${name}
2. Address for Correspondence: [COMPLETE POSTAL ADDRESS]
3. Particulars of Information Required:
   a) Subject matter of Information: ${facts}
   b) Period to which information relates: ${date}
   c) Description of specific records / files / orders required:
      (i) Certified copy of [SPECIFIC DOCUMENT 1]
      (ii) Inspection of records regarding [SPECIFIC TOPIC]
4. Mode of Information required: By Post / Certified Copy / Inspection
5. RTI Application Fee:
   - Postal Order / Demand Draft / Online Receipt No: [INSERT RECEIPT NO] dated [DATE] for Rs. 10/-
   - (Or: BPL Card attached for fee exemption)

Declaration: I state that I am a citizen of India and the information sought falls within the mandate of the RTI Act, 2005.

Date: ${new Date().toLocaleDateString()}
Place: Kota, Rajasthan

Signature of Applicant: _________________________
Name: ${name}`;
    }

    setGeneratedDraft(draft);
  };

  const handleCopy = () => {
    if (!generatedDraft) return;
    navigator.clipboard.writeText(generatedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    if (!generatedDraft) return;
    const blob = new Blob([generatedDraft], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `haqnaama_draft_${templateType}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if (!generatedDraft) return;
    const newDraft: PreparedDraft = {
      id: `draft-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      template_type: templateType,
      title: templateType.replace('_', ' ').toUpperCase(),
      subject: `Draft for ${recipient || 'Authority'}`,
      recipient_authority: recipient || 'Designated Authority',
      facts: [factSummary],
      allegations_disclaimer: 'User-drafted representation. Not an official court filing.',
      missing_placeholders: ['[INSERT TRANSACTION ID]', '[INSERT BILL NUMBER]'],
      draft_text: generatedDraft,
      status: 'draft',
    };
    saveDraft(newDraft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/30 rounded-md text-xs font-bold text-[#F28C28] mb-3">
          <FileText className="w-3.5 h-3.5" />
          <span>Document Preparation Workbench</span>
        </div>
        <h1 className="text-3xl font-black text-[#202020]">
          {t.nav.complaint_assistant}
        </h1>
        <p className="text-sm text-[#202020]/75 mt-1 max-w-2xl leading-relaxed">
          Prepare clean, source-grounded representations, bank intimation notices, and RTI applications.
          All templates clearly identify missing placeholders and prevent fabricated statements.
        </p>
      </div>

      {/* Safety Notice */}
      <div className="bg-[#202020] text-[#F4F0E6] rounded-xl p-4 sm:p-5 flex items-start gap-3 text-xs leading-relaxed">
        <ShieldAlert className="w-5 h-5 text-[#F28C28] shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-white mb-0.5">Important Drafting Disclosure:</p>
          <p className="text-[#F4F0E6]/80">
            Generating a draft document in HAQNAAMA does <strong>NOT</strong> submit it to any court, police station, or government department. You must review, fill in the marked bracketed placeholders ([...]), print or upload to the official portal personally, and obtain an official receipt/acknowledgement.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-5 bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-[#202020] uppercase tracking-wider">
            1. Select Template & Enter Facts
          </h2>

          <form onSubmit={generateDraft} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#202020]/80 mb-1">
                Document Template Type
              </label>
              <select
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value as PreparedDraft['template_type'])}
                className="w-full p-2.5 bg-[#F4F0E6]/40 border border-[#202020]/20 rounded-lg text-xs font-medium text-[#202020]"
              >
                <option value="consumer_grievance">Consumer Grievance / Refund Demand</option>
                <option value="cyber_fraud_intimation">Bank Cyber Fraud Freeze Notice (1930)</option>
                <option value="police_representation">Police Station Written Complaint</option>
                <option value="rti_application">Right to Information (RTI) Application</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#202020]/80 mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full p-2.5 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg text-xs text-[#202020] focus:border-[#F28C28] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#202020]/80 mb-1">
                Recipient Authority / Opposite Party
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. State Bank of India / Kota Coaching Institute"
                className="w-full p-2.5 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg text-xs text-[#202020] focus:border-[#F28C28] outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold uppercase text-[#202020]/80 mb-1">
                  Date of Event
                </label>
                <input
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full p-2.5 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg text-xs text-[#202020]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#202020]/80 mb-1">
                  Amount / Claim (₹)
                </label>
                <input
                  type="text"
                  value={amountLoss}
                  onChange={(e) => setAmountLoss(e.target.value)}
                  placeholder="e.g. 45000"
                  className="w-full p-2.5 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg text-xs text-[#202020]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#202020]/80 mb-1">
                Factual Narrative
              </label>
              <textarea
                rows={4}
                value={factSummary}
                onChange={(e) => setFactSummary(e.target.value)}
                placeholder="Briefly summarize what happened chronologically..."
                className="w-full p-2.5 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg text-xs text-[#202020] focus:border-[#F28C28] outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#F28C28] hover:bg-[#D9771E] text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
            >
              Assemble Draft Document
            </button>
          </form>
        </div>

        {/* Right Preview */}
        <div className="lg:col-span-7 bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#202020]/10 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#F28C28]">
                  Draft Preview
                </span>
                <h3 className="text-sm font-bold text-[#202020]">
                  Editable Document Output
                </h3>
              </div>

              {generatedDraft && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 px-2.5 bg-[#F4F0E6] hover:bg-black/10 text-xs font-semibold rounded-md flex items-center gap-1 text-[#202020]"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-1.5 px-2.5 bg-[#F4F0E6] hover:bg-black/10 text-xs font-semibold rounded-md flex items-center gap-1 text-[#202020]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="p-1.5 px-2.5 bg-[#202020] hover:bg-black text-xs font-bold rounded-md flex items-center gap-1 text-white"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saved ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              )}
            </div>

            {generatedDraft ? (
              <textarea
                value={generatedDraft}
                onChange={(e) => setGeneratedDraft(e.target.value)}
                rows={16}
                className="w-full p-4 bg-[#F4F0E6]/25 border border-[#202020]/15 rounded-xl font-mono text-xs text-[#202020] leading-relaxed focus:bg-white focus:border-[#F28C28] outline-hidden"
              />
            ) : (
              <div className="p-12 text-center text-xs text-[#202020]/60 space-y-2">
                <FileText className="w-8 h-8 text-[#202020]/30 mx-auto" />
                <p className="font-semibold text-[#202020]">No draft assembled yet.</p>
                <p>Fill out the parameters on the left and click "Assemble Draft Document".</p>
              </div>
            )}
          </div>

          {generatedDraft && (
            <div className="pt-3 border-t border-[#202020]/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#202020]/60 gap-2">
              <span>Notice placeholders marked in [BRACKETS]</span>
              <button
                onClick={() => navigate('/my-workspace')}
                className="text-[#F28C28] font-bold underline"
              >
                View Saved Drafts in Workspace →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
