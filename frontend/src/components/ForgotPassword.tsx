import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { forgotPasswordApi, resetPasswordApi } from "../api/authApi";
import toast from "react-hot-toast";

const ForgotPassword = () => {
    const { setShowForgotPassword, setShowUserLogin } = useAppContext();

    const [step, setStep] = useState<'email' | 'otp' | 'done'>('email');
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await forgotPasswordApi(email.trim());
            toast.success("Reset OTP sent to your email!");
            setStep('otp');
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 6) { toast.error("Password must be 6+ characters"); return; }
        if (newPassword !== confirmPassword) { toast.error("Passwords don't match"); return; }
        setLoading(true);
        try {
            await resetPasswordApi(email.trim(), otp, newPassword);
            toast.success("Password reset! Please login.");
            setStep('done');
            setTimeout(() => {
                setShowForgotPassword(false);
                setShowUserLogin(true);
            }, 1500);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div onClick={() => setShowForgotPassword(false)} className="fixed inset-0 z-50 flex items-center text-sm text-gray-600 bg-black/50">
            <form
                onClick={(e) => e.stopPropagation()}
                onSubmit={step === 'email' ? handleSendOtp : handleReset}
                className="flex flex-col gap-4 m-auto items-start p-8 py-10 w-80 sm:w-[360px] rounded-lg shadow-xl border border-gray-200 bg-white"
            >
                <p className="text-2xl font-medium m-auto">
                    <span className="text-primary">Reset</span> Password
                </p>

                {step === 'email' && (
                    <div className="w-full">
                        <p>Enter your email address</p>
                        <input
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            type="email"
                            placeholder="you@email.com"
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                            required
                        />
                    </div>
                )}

                {step === 'otp' && (
                    <>
                        <p className="text-gray-500 text-center w-full">
                            OTP sent to <span className="font-medium text-gray-800">{email}</span>
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
                        <div className="w-full">
                            <p>New Password</p>
                            <input
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                type="password"
                                placeholder="••••••"
                                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <p>Confirm Password</p>
                            <input
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                type="password"
                                placeholder="••••••"
                                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                                required
                            />
                        </div>
                    </>
                )}

                {step === 'done' && (
                    <p className="text-green-600 text-center w-full font-medium">
                        Password reset successful! Redirecting to login...
                    </p>
                )}

                <div className="flex justify-between w-full">
                    <button type="button" onClick={() => { setShowForgotPassword(false); setShowUserLogin(true); }} className="text-xs text-primary cursor-pointer hover:underline">
                        ← Back to login
                    </button>
                </div>

                {step !== 'done' && (
                    <button type="submit" disabled={loading} className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-60">
                        {loading ? "Please wait..." : step === 'email' ? "Send OTP" : "Reset Password"}
                    </button>
                )}
            </form>
        </div>
    );
};

export default ForgotPassword;
