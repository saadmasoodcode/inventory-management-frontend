import { Button, Paper, styled, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "react-toastify/dist/ReactToastify.css";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const FormContainer = styled(Paper)`
  border: 1px solid silver;
  padding: 10px;
  width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10vh auto;
  border-radius: 5px;
  flex-direction: column;
`;

const InputBox = styled("div")`
  display: flex;
  flex-direction: column;
  margin-bottom: 7px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  margin-top: 10px;
  margin-bottom: 20px;
`;

const StyledLabel = styled("label")`
  font-weight: 900;
  margin-bottom: 5px;
`;

const StyledInput = styled(TextField)`
  border-radius: 20px;
  width: 250px;
`;

const ErrorMsg = styled("p")`
  color: red;
  font-weight: 900;
`;

const StyledDiv = styled("div")`
  position: relative;
  width: 250px;
`;

const StyledPwInput = styled(TextField)`
  width: 100%;
  input {
    padding-right: 40px;
  }
`;

const StyledViewIcon1 = styled(VisibilityOffIcon)`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #888;
`;

const StyledViewIcon2 = styled(VisibilityIcon)`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #888;
`;

const Home = () => {
  const schema = yup.object().shape({
    email: yup.string().email("Invalid Email").required(),
    password: yup.string().required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });


  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <FormContainer elevation={10}>
      <h1>Login</h1>
      <form
        onSubmit={handleSubmit((data: any) => {
          console.log(data);
          if (data.email === "saad@gmail.com" && data.password === "admin") {
            navigate("/dashboard");
          } else {
            toast.error("Incorrect Email or Password", {
              position: "bottom-right",
              autoClose: 2000,
              theme: "dark",
            });
          }
        })}
      >
        <InputBox>
          <StyledLabel>Email *</StyledLabel>
          <StyledInput {...register("email")} />
          <ErrorMsg>{errors.email?.message}</ErrorMsg>
        </InputBox>
        <InputBox>
          <StyledLabel>Password *</StyledLabel>

          <StyledDiv>
            <StyledPwInput
              type={showPassword ? "text" : "password"}
              {...register("password")}
            />
            {showPassword ? (
              <StyledViewIcon1 onClick={() => setShowPassword(!showPassword)} />
            ) : (
              <StyledViewIcon2 onClick={() => setShowPassword(!showPassword)} />
            )}
          </StyledDiv>

          <ErrorMsg>{errors.password?.message}</ErrorMsg>
        </InputBox>
        <div>
          <StyledButton variant="contained" type="submit">
            Login
          </StyledButton>
        </div>
      </form>
      <ToastContainer />
    </FormContainer>
  );
};

export default Home;
