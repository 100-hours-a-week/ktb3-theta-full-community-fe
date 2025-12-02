import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import Button from "../components/common/Button";
import ErrorMessage from "../components/common/ErrorMessage";
import Input from "../components/common/Input";
import { useLogin } from "../features/auth/hooks";
import { useUser } from "../contexts/useUser";
import { useForm } from "../hooks/useForm";
import { usePageRouter } from "../hooks/usePageRouter";
import styles from "./Login.module.css";

function Login() {
  const { user } = useUser();
  const { goToJoin, goToHome } = usePageRouter();
  const loginMutation = useLogin();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, errors, isSubmitting } = useForm({
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (user) {
      goToHome();
    }
  }, [user, goToHome]);

  const onSubmit = (values) => {
    setServerError("");
    loginMutation.mutate(
      { email: values.email, password: values.password },
      {
        onError: (err) => {
          const message = err?.response?.data?.message || "";
          if (message) {
            setServerError(message);
          } else {
            setServerError("아이디/비밀번호를 확인해주세요.");
          }
        },
      }
    );
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>로그인</h1>
      <span className={styles.subtitle}>커뮤니티에 오신 걸 환영합니다!</span>

      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <label className={styles.label} htmlFor="email">
            이메일
          </label>
          <Input
            type="email"
            id="email"
            placeholder="이메일을 입력하세요"
            {...register("email", {
              required: { message: "이메일을 입력해주세요." },
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)",
              },
            })}
          />
          <ErrorMessage className={styles.error} message={errors.email} />

          <label className={styles.label} htmlFor="password">
            비밀번호
          </label>
          <Input
            type="password"
            id="password"
            placeholder="비밀번호를 입력하세요"
            {...register("password", {
              required: { message: "비밀번호를 입력해주세요." },
              pattern: {
                value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?\":{}|<>]).{8,20}$/,
                message: "비밀번호는 8~20자, 대문자/소문자/숫자/특수문자 각 1개 이상 포함해야 합니다.",
              },
            })}
          />
          <ErrorMessage className={styles.error} message={errors.password} />
          <ErrorMessage className={styles.error} message={serverError} />

          <Button type="submit" variant="primary" className={styles.submit} disabled={isSubmitting || loginMutation.isPending}>
            로그인
          </Button>
        </form>

        <div className={styles.joinContainer}>
          <div className={styles.separate}>
            <hr />
            <span>또는</span>
            <hr />
          </div>
          <Link className={styles.joinLink} to="/join" onClick={goToJoin}>
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
