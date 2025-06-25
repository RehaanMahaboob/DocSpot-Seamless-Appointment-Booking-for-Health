// React Imports
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// React Icons
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
// Formik Imports
import { Form, Formik, FormikProps } from "formik";
// Utils Imports
import { onKeyDown } from "../../utils";
// Validation Schema
import { signupSchema } from "./components/validationSchema";
// MUI Imports
import { Box, Button, Typography } from "@mui/material";
// Custom Imports
import { Heading, SubHeading } from "../../components/Heading";
import ToastAlert from "../../components/ToastAlert/ToastAlert";
import PrimaryInput from "../../components/PrimaryInput/PrimaryInput";
// Images Imports
import NextWhiteLogo from "../../assets/images/nexCenterLogo.svg";
// Redux API
import { useSignupMutation } from "../../redux/api/authApiSlice";
import PrimaryPhoneInput from "../../components/PhoneInput";
import BackgroundImage from "../../assets/images/doc.png";

interface ISSignupForm {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState<ISSignupForm>({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [toast, setToast] = useState({ message: "", appearence: false, type: "" });
  const [signupUser, { isLoading }] = useSignupMutation();

  const hideShowPassword = () => setShowPassword(!showPassword);
  const handleCloseToast = () => setToast({ ...toast, appearence: false });

  const signupHandler = async (data: ISSignupForm) => {
    const payload = { ...data };
    try {
      const user: any = await signupUser(payload);
      if (user?.data?.status) {
        setToast({ message: "User Successfully Created", appearence: true, type: "success" });
        setTimeout(() => navigate("/login"), 1500);
      } else if (user?.error) {
        setToast({ message: user?.error?.data?.message, appearence: true, type: "error" });
      }
    } catch (error) {
      console.error("SignUp Error:", error);
      setToast({ message: "Something went wrong", appearence: true, type: "error" });
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
        <Box sx={{ width: "100%", maxWidth: 500, bgcolor: "#ffffffdd", p: 4, borderRadius: 4, boxShadow: 3, backdropFilter: "blur(8px)" }}>

          <Box sx={{
            backgroundImage: `url(${BackgroundImage})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            width: "100%",
            height: 180,
            borderRadius: 2,
            mb: 3,
          }} />

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
            Create an Account
          </Typography>

          <Formik
            initialValues={formValues}
            onSubmit={(values: ISSignupForm) => signupHandler(values)}
            validationSchema={signupSchema}
          >
            {(props: FormikProps<ISSignupForm>) => {
              const { values, touched, errors, handleBlur, handleChange } = props;
              return (
                <Form onKeyDown={onKeyDown}>
                  <Box sx={{ mb: 2 }}>
                    <SubHeading sx={{ mb: 1 }}>Name</SubHeading>
                    <PrimaryInput
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={values.name}
                      helperText={touched.name && errors.name ? errors.name : ""}
                      error={touched.name && Boolean(errors.name)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <SubHeading sx={{ mb: 1 }}>Email</SubHeading>
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
                    <SubHeading sx={{ mb: 1 }}>Mobile Number</SubHeading>
                    <PrimaryPhoneInput
                      value={props.values.phoneNumber || '+91'}
                      name="phoneNumber"
                      formik={props}
                      variant="outlined"
                      label=""
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <SubHeading sx={{ mb: 1 }}>Password</SubHeading>
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
                    Already have an account?{' '}
                    <Link to="/login" style={{ fontWeight: 600, textDecoration: "none", color: "#1e40af" }}>
                      Login
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
                    {isLoading ? "Signing up..." : "Sign Up"}
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

export default Signup;
