// React Imports
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// Formik Imports
import { Form, Formik, FormikProps } from "formik";
// MUI Imports
import { Button, Box, Typography } from "@mui/material";
// Custom Imports
import { SubHeading } from "../../components/Heading";
import PrimaryInput from "../../components/PrimaryInput/PrimaryInput";
import ToastAlert from "../../components/ToastAlert/ToastAlert";
// React Icons Imports
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
// Validation Schema Imports
import { loginSchema } from "./components/validationSchema";
// Utils Imports
import { onKeyDown } from "../../utils";
// Images Imports
import BottomLogo from "../../assets/images/bottomLogo.svg";
// Redux API
import { useLoginMutation } from "../../redux/api/authApiSlice";
import { setUser } from "../../redux/auth/authSlice";
import BackgroundImage from "../../assets/images/photo1.png";

interface ISLoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formValues] = useState<ISLoginForm>({ email: "", password: "" });
  const [toast, setToast] = useState({ message: "", appearence: false, type: "" });
  const [loginUser, { isLoading }] = useLoginMutation();

  const hideShowPassword = () => setShowPassword(!showPassword);
  const handleCloseToast = () => setToast({ ...toast, appearence: false });

  const LoginHandler = async (data: ISLoginForm) => {
    try {
      const user: any = await loginUser(data);
      if (user?.data?.status) {
        dispatch(setUser(user?.data));
        localStorage.setItem("user", JSON.stringify(user?.data));
        navigate("/");
      } else if (user?.error) {
        setToast({ ...toast, message: user?.error?.data?.message, appearence: true, type: "error" });
      }
    } catch (error) {
      console.error("Login Error:", error);
      setToast({ ...toast, message: "Something went wrong", appearence: true, type: "error" });
    }
  };

  return (
    <>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        px: 2,
        py: 4,
        background: "linear-gradient(135deg, #e0f7fa, #f0f4ff)",
      }}>
        <Box
          sx={{
            width: "100%",
            maxWidth: 480,
            bgcolor: "#ffffffdd",
            p: 4,
            borderRadius: 4,
            boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Box
            sx={{
              backgroundImage: `url(${BackgroundImage})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              width: "100%",
              height: 230,
              borderRadius: 2,
              mb: 3,
            }}
          />

          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              mb: 1,
              textTransform: "uppercase",
              letterSpacing: "1.2px",
              textAlign: "center",
              textDecoration: "underline",
            }}
          >
            Appoint your doctor
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              mb: 3,
              fontFamily: "'Inter', sans-serif",
              textAlign: "center",
              color: "#333",
            }}
          >
            Login to continue
          </Typography>

          <Formik
            initialValues={formValues}
            onSubmit={(values: ISLoginForm) => LoginHandler(values)}
            validationSchema={loginSchema}
          >
            {(props: FormikProps<ISLoginForm>) => {
              const { values, touched, errors, handleBlur, handleChange } = props;
              return (
                <Form onKeyDown={onKeyDown}>
                  <Box sx={{ mb: 3 }}>
                    <SubHeading sx={{ mb: 1, color: "black" }}>Email</SubHeading>
                    <PrimaryInput
                      type="text"
                      name="email"
                      placeholder="Email"
                      value={values.email}
                      helperText={touched.email && errors.email ? errors.email : ""}
                      error={touched.email && Boolean(errors.email)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <SubHeading sx={{ mb: 1, color: "black" }}>Password</SubHeading>
                    <PrimaryInput
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={values.password}
                      helperText={touched.password && errors.password ? errors.password : ""}
                      error={touched.password && Boolean(errors.password)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onClick={hideShowPassword}
                      endAdornment={showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                    />
                  </Box>
                  <Typography sx={{ fontSize: 14, mb: 2, textAlign: "center" }}>
                    New here?{' '}
                    <Link to="/signup" style={{ fontWeight: 600, textDecoration: "none", color: "#1e40af" }}>
                      Create a new account
                    </Link>
                  </Typography>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isLoading}
                    sx={{
                      py: 1.5,
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: 16,
                      borderRadius: 2,
                      backgroundColor: "#2563eb",
                      '&:hover': {
                        backgroundColor: "#1e40af",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Box>

      <ToastAlert appearence={toast.appearence} type={toast.type} message={toast.message} handleClose={handleCloseToast} />
    </>
  );
};

export default Login;
