import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useAppDispatch } from "../store/hooks";
import { loginSuccess } from "../store/slices/userSlice";
import { sendRegisterOtp, verifyOtpAndRegister } from "../api/authApi";
import toast from "react-hot-toast";

const ROLES = ['User', 'Owner', 'Company', 'Agent', 'Dealer', 'Builder'];

const Register = () => {
    const { setShowRegister, setShowUserLogin, navigate } = useAppContext();
    const dispatch = useAppDispatch();

    const [step, setStep] = useState<'form' | 'otp'>('form');
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("User");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) { toast.error("Name is required"); return; }
        if (password.length < 6) { toast.error("Password must be 6+ characters"); return; }
        setLoading(true);
        try {
            await sendRegisterOtp(email.trim(), phone);
            toast.success("OTP sent to your email!");
            setStep('otp');
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) { toast.error("Enter 6-digit OTP"); return; }
        setLoading(true);
        try {
            const { data } = await verifyOtpAndRegister({
                name: name.trim(), email: email.trim(), password, phone, role, otp,
            });
            dispatch(loginSuccess({
                profile: {
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                    phone: data.user.phone,
                    role: data.user.role,
                    avatar: data.user.avatar,
                    createdAt: data.user.createdAt,
                },
                token: data.token,
            }));
            toast.success(`Welcome, ${data.user.name}!`);
            setShowRegister(false);
            navigate("/");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div onClick={() => setShowRegister(false)} className="fixed inset-0 z-50 flex items-center text-sm text-gray-600 bg-black/50">
            <form
                onClick={(e) => e.stopPropagation()}
                onSubmit={step === 'form' ? handleSendOtp : handleVerify}
                className="flex flex-col gap-4 m-auto items-start p-8 py-10 w-80 sm:w-[380px] rounded-lg shadow-xl border border-gray-200 bg-white max-h-[90vh] overflow-y-auto"
            >
                <p className="text-2xl font-medium m-auto">
                    <span className="text-primary">Create</span> Account
                </p>

                {step === 'form' && (
                    <>
                        <div className="w-full">
                            <p>Full Name *</p>
                            <input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" required />
                        </div>
                        <div className="w-full">
                            <p>Email *</p>
                            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@email.com" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" required />
                        </div>
                        <div className="w-full">
                            <p>Password * <span className="text-xs text-gray-400">(min 6 chars)</span></p>
                            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" required />
                        </div>
                        <div className="w-full">
                            <p>Phone</p>
                            <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="9876543210" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" />
                        </div>
                        <div className="w-full">
                            <p>Register as</p>
                            <select value={role} onChange={e => setRole(e.target.value)} className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary">
                                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                    </>
                )}

                {step === 'otp' && (
                    <>
                        <p className="text-gray-500 text-center w-full">
                            We sent a 6-digit OTP to <span className="font-medium text-gray-800">{email}</span>
                        </p>
                        <div className="w-full">
                            <p>Enter OTP</p>
                            <input
                                value={otp}
                                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="123456"
                                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary text-center text-lg tracking-widest"
                                maxLength={6}
                                required
                            />
                        </div>
                        <button type="button" onClick={() => setStep('form')} className="text-xs text-primary cursor-pointer hover:underline">
                            ← Back to form
                        </button>
                    </>
                )}

                <p>
                    Already have an account?{" "}
                    <span onClick={() => { setShowRegister(false); setShowUserLogin(true); }} className="text-primary cursor-pointer">Login</span>
                </p>

                <button type="submit" disabled={loading} className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-60">
                    {loading ? "Please wait..." : step === 'form' ? "Send OTP" : "Verify & Register"}
                </button>
            </form>
        </div>
    );
};

export default Register;
