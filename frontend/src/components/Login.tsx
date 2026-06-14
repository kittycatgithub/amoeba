import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useAppDispatch } from "../store/hooks";
import { loginSuccess } from "../store/slices/userSlice";
import { loginApi } from "../api/authApi";
import toast from "react-hot-toast";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

const Login = () => {
    const { setShowUserLogin, setShowRegister, setShowForgotPassword, navigate } = useAppContext();
    const dispatch = useAppDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        try {
            const { data } = await loginApi(email.trim(), password);
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
                // token: data.token,
            }));
            toast.success(`Welcome back, ${data.user.name}!`);
            setShowUserLogin(false);
            navigate("/");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div onClick={() => setShowUserLogin(false)} className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center text-sm text-gray-600 bg-black/50">
        <form onClick={(e) => e.stopPropagation()}
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
                <span className="text-primary">User</span> Login
            </p>
            <div className="w-full">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
            </div>
            <div className="w-full">
                <p>Password</p>
                <div className="flex flex-row">
                    <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="relative border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                       type={showPassword ? "text" : "password"} required />
                    <span
                        className="right-3 flex items-center mt-1 -ml-7 z-40 top-[47px] text-sm text-black cursor-pointer select-none"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <IoEyeOffOutline className="w-5 h-5"/> : <IoEyeOutline className="w-5 h-5"/>}
                    </span>
                </div>
            </div>
            <button
                type="button"
                onClick={() => { setShowUserLogin(false); setShowForgotPassword(true); }}
                className="text-xs text-primary cursor-pointer hover:underline self-end -mt-2"
            >
                Forgot Password?
            </button>
            <p>
                Don't have an account?{" "}
                <span onClick={() => { setShowUserLogin(false); setShowRegister(true); }} className="text-primary cursor-pointer">
                    Register here
                </span>
            </p>
            <button type="submit" disabled={loading} className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-60">
                {loading ? "Logging in..." : "Login"}
            </button>
        </form>
        </div>
    );
};
export default Login;