import jwt from 'jsonwebtoken'

// Login Admin : /api/admin/login
export const adminLogin = async ( req, res ) => {
    try {
        const { email, password } = req.body;

        if(password === process.env.ADMIN_PASSWORD && email === process.env.ADMIN_EMAIL){
            // sign token 
            const token = jwt.sign({email}, process.env.JWT_SECRET, { expiresIn: '7d' })
        
            res.cookie('adminToken', token, {
                httpOnly: true,    //Prevent JavaScript to access cookie
                secure: process.env.NODE_ENV === 'production',    // Use secure cookies in production
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // cross-site in production - CSRF protection
                maxAge: 7 * 24 * 60 * 60 * 1000,                  // 7 days in ms - Cookie expiration time
            });
            return res.json({ success:true, message: "Power Developer Logged In" })
        } else {
            return res.json({ success:false, message:"Invalid Credentials" })
        }
    } catch (error) {
        console.log(error.message)
        return res.json({ success: false, message: error.message })
    }
}

// Admin isAuth : /api/admin/is-auth
export const isAdminAuth = async ( req,res ) => {
    try {
        return res.json({success: true})
    } catch (error) {
        console.log(error.message)
        return res.json({success: false, message: error.message })
    }
}

// Logout Admin : /api/admin/logout
export const adminLogout = ( req, res ) => {
    try {
        res.clearCookie('adminToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', //you can use strict instead of lax
        });
        res.json({ success:true, message: 'Logged out successfully' });
    } catch (error) {
        console.log(error.message)
        return res.json({success: false, message: error.message })
    }
}