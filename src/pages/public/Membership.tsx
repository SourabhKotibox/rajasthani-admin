import { useState } from 'react';
import { api } from '@/api/client';
import { useAppSelector } from '@/store';
import { MembershipCard } from '@/components/MembershipCard';
import { UploadCloud, CheckCircle, CreditCard, AlertCircle } from 'lucide-react';

export default function Membership() {
  const branding = useAppSelector((s) => s.branding);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [membershipData, setMembershipData] = useState<any>(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    age: '',
    gender: 'Male',
    dob: '',
    qualification: '',
    presentStatus: '',
    address: '',
    pincode: '',
    contact: '',
    aadharNo: '',
    email: '',
    occupation: '',
    proposedBy: '',
    proposedByMembershipNo: '',
    secondedBy: '',
    secondedByMembershipNo: '',
    photoUrl: '',
  });

  const showError = (msg: string) => { setError(msg); setSuccessMsg(''); setTimeout(() => setError(''), 5000); };
  const showSuccess = (msg: string) => { setSuccessMsg(msg); setError(''); setTimeout(() => setSuccessMsg(''), 5000); };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { url } = await api.upload(fd);
      setFormData(prev => ({ ...prev, photoUrl: url }));
      showSuccess('Photo uploaded successfully');
    } catch (err: any) {
      showError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showError('Name and email are required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // 1. Create membership application
      const m = await api.createMembership(formData) as any;
      setMembershipData(m);

      // 2. Create Razorpay order
      const order = await api.createOrder({
        amount: 1000,
        currency: 'INR',
        membershipId: m.id,
        applicantEmail: formData.email
      });

      // 3. Setup Razorpay options
      const options = {
        key: (order as any).keyId || 'dummy_key',
        amount: (order as any).amount,
        currency: (order as any).currency,
        name: branding.platformName || 'Rajasthan Cine Association',
        description: 'Membership Registration Fee',
        order_id: (order as any).id,
        handler: async (response: any) => {
          try {
            if ((order as any).mock) {
              setMembershipData({ ...m, membershipNo: 'RCA-' + Math.floor(1000 + Math.random() * 9000) });
              showSuccess('Payment successful!');
              setStep(2);
            } else {
              await api.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                membershipId: m.id
              });
              const updated = await api.getMembershipById(m.id);
              setMembershipData(updated);
              showSuccess('Payment successful!');
              setStep(2);
            }
          } catch (err: any) {
            showError(err.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.contact
        },
        theme: {
          color: branding.primaryColor || '#F5C842'
        }
      };

      // Mock payment for dev (when Razorpay not configured)
      if ((order as any).mock) {
        showSuccess('Processing mock payment…');
        setTimeout(() => options.handler({}), 1500);
      } else {
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', (r: any) => showError(r.error.description));
        rzp.open();
      }
    } catch (err: any) {
      showError(err.message || 'Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  if (step === 2 && membershipData) {
    return (
      <div className="animate-fade-in" style={{ padding: '6rem 1.25rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <CheckCircle size={60} style={{ color: 'var(--color-success)', margin: '0 auto 1.5rem' }} />
        <h1 className="font-serif" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Welcome to {branding.platformName || 'Rajasthan Cine Association'}!</h1>
        <p style={{ color: 'var(--color-muted-foreground)', marginBottom: '3rem', fontSize: '1.1rem' }}>
          Your payment of ₹1000 was successful. Below is your official membership card.
        </p>
        
        <MembershipCard membership={membershipData} branding={branding} />
        
        <div style={{ marginTop: '3rem' }}>
          <button className="btn-outline" onClick={() => window.print()}>
            Print Card
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ background: 'var(--color-surface)', minHeight: '100dvh', padding: '4rem 1.25rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '3rem', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="font-serif" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Membership Registration Form</h1>
          <p style={{ color: 'var(--color-muted-foreground)' }}>Fill out the details below to join the association. Registration fee is ₹1000.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Inline alerts */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '0.75rem 1rem', color: '#991B1B', fontSize: '0.9rem' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}
          {successMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: '8px', padding: '0.75rem 1rem', color: '#065F46', fontSize: '0.9rem' }}>
              <CheckCircle size={16} /> {successMsg}
            </div>
          )}
          {/* Photo Upload */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: '120px', height: '150px', background: 'var(--color-background)', border: '2px dashed var(--color-border)', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              {formData.photoUrl ? (
                <img src={formData.photoUrl} alt="Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ color: 'var(--color-muted-foreground)', textAlign: 'center' }}>
                  <UploadCloud size={24} style={{ margin: '0 auto' }} />
                  <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', display: 'block' }}>Passport Photo</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label className="label">Name</label>
              <input type="text" className="field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div>
              <label className="label">Father/Husband's Name</label>
              <input type="text" className="field" value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} />
            </div>
            <div>
              <label className="label">Age</label>
              <input type="number" className="field" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
            </div>
            <div>
              <label className="label">Gender</label>
              <select className="field" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="label">Date of Birth</label>
              <input type="date" className="field" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
            </div>
            <div>
              <label className="label">Qualification</label>
              <input type="text" className="field" value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} />
            </div>
            <div>
              <label className="label">At present I am</label>
              <input type="text" className="field" value={formData.presentStatus} onChange={e => setFormData({...formData, presentStatus: e.target.value})} />
            </div>
            <div>
              <label className="label">Occupation</label>
              <input type="text" className="field" value={formData.occupation} onChange={e => setFormData({...formData, occupation: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="label">Address</label>
            <textarea className="field" rows={2} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label className="label">Pincode</label>
              <input type="text" className="field" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
            </div>
            <div>
              <label className="label">Contact No.</label>
              <input type="tel" className="field" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
            </div>
            <div>
              <label className="label">Aadhar No.</label>
              <input type="text" className="field" value={formData.aadharNo} onChange={e => setFormData({...formData, aadharNo: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="label">Email</label>
            <input type="email" className="field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>

          <div style={{ background: 'var(--color-background)', padding: '1.5rem', borderRadius: '8px', marginTop: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted-foreground)', marginBottom: '1rem', fontStyle: 'italic' }}>
              Note: Proposed & Seconded by our life time & Regular member only.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label className="label">Proposed by (Name)</label>
                <input type="text" className="field" value={formData.proposedBy} onChange={e => setFormData({...formData, proposedBy: e.target.value})} />
                <label className="label" style={{ marginTop: '0.75rem' }}>Membership No.</label>
                <input type="text" className="field" value={formData.proposedByMembershipNo} onChange={e => setFormData({...formData, proposedByMembershipNo: e.target.value})} />
              </div>
              <div>
                <label className="label">Seconded by (Name)</label>
                <input type="text" className="field" value={formData.secondedBy} onChange={e => setFormData({...formData, secondedBy: e.target.value})} />
                <label className="label" style={{ marginTop: '0.75rem' }}>Membership No.</label>
                <input type="text" className="field" value={formData.secondedByMembershipNo} onChange={e => setFormData({...formData, secondedByMembershipNo: e.target.value})} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(245, 200, 66, 0.1)', border: '1px solid var(--color-primary-subtle)', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>
              Registration Fee: ₹1000
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '1rem' }}>
              <CreditCard size={18} />
              {loading ? 'Processing...' : 'Pay & Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
