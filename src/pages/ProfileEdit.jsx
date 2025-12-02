import { useEffect, useMemo, useRef, useState } from "react";
import Button from "../components/common/Button";
import ErrorMessage from "../components/common/ErrorMessage";
import Input from "../components/common/Input";
import Modal from "../components/common/Modal";
import { useForm } from "../hooks/useForm";
import { useFetchUser, useUpdatePassword, useUpdateUser, useDeleteUser } from "../features/users/hooks";
import { usePageRouter } from "../hooks/usePageRouter";
import { useUser } from "../contexts/useUser";
import { showToast } from "../lib/toast";
import styles from "./ProfileEdit.module.css";
import { resolveImageUrl } from "../utils/image";

const PASSWORD_RULE = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/;

function ProfileEdit() {
  const { data: userData, isLoading: isUserLoading } = useFetchUser();
  const updateUserMutation = useUpdateUser();
  const updatePasswordMutation = useUpdatePassword();
  const deleteUserMutation = useDeleteUser();
  const { goToLogin } = usePageRouter();
  const { clearUser } = useUser();

  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  const fileInputRef = useRef(null);
  const initialNicknameRef = useRef("");

  const defaultValues = useMemo(() => ({ email: "", nickname: "", password: "", passwordConfirm: "" }), []);

  const { register, handleSubmit, errors, isSubmitting, reset, getValues, setValue } = useForm({
    defaultValues,
  });

  useEffect(() => {
    const profile = userData?.result;
    if (!profile) return;

    initialNicknameRef.current = profile.nickname || "";
    setEmail(profile.email || "");
    const nextImage = profile.profile_image || "";
    setProfileImageUrl(nextImage);
    setPreviewUrl(nextImage);
    setSelectedFile(null);
    setRemoveImage(false);
    reset({
      email: profile.email || "",
      nickname: profile.nickname || "",
      password: "",
      passwordConfirm: "",
    });
  }, [userData, reset]);

  const isBusy =
    isSubmitting ||
    isUserLoading ||
    updateUserMutation.isPending ||
    updatePasswordMutation.isPending ||
    deleteUserMutation.isPending;

  const handleAvatarPick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
      setRemoveImage(false);
    } else {
      setPreviewUrl(profileImageUrl);
    }
  };

  const handleImageRemove = () => {
    setSelectedFile(null);
    setRemoveImage(true);
    setProfileImageUrl("");
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteUserMutation.mutateAsync();
      clearUser();
      goToLogin();
    } finally {
      setDeleteOpen(false);
    }
  };

  const onSubmit = async (values) => {
    const trimmedNickname = values.nickname?.trim() || "";
    const nicknameChanged = trimmedNickname !== initialNicknameRef.current;
    const imageChanged = Boolean(selectedFile) || removeImage;
    const profileChanged = nicknameChanged || imageChanged;
    const passwordChanged = Boolean(values.password);

    if (!profileChanged && !passwordChanged) {
      showToast("변경할 정보가 없습니다.", { type: "info" });
      return;
    }

    const requests = [];
    let profilePromise;
    let passwordPromise;

    if (profileChanged) {
      const payload = {
        nickname: trimmedNickname,
        profile_image: removeImage ? "" : profileImageUrl || "",
      };
      profilePromise = updateUserMutation.mutateAsync({ payload, profileImage: selectedFile || undefined });
      requests.push(profilePromise);
    }

    if (passwordChanged) {
      passwordPromise = updatePasswordMutation.mutateAsync({ password: values.password });
      requests.push(passwordPromise);
    }

    try {
      const results = await Promise.all(requests);

      if (profilePromise) {
        const profileRes = results[0];
        const updated = profileRes?.result || {};
        initialNicknameRef.current = updated.nickname ?? trimmedNickname;
        const nextImage = updated.profile_image ?? profileImageUrl;
        setProfileImageUrl(nextImage || "");
        setPreviewUrl(nextImage || "");
        setRemoveImage(false);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        reset({
          email,
          nickname: updated.nickname ?? trimmedNickname,
          password: "",
          passwordConfirm: "",
        });
      } else {
        setValue("password", "", { shouldValidate: false });
        setValue("passwordConfirm", "", { shouldValidate: false });
      }

      if (passwordPromise) {
        setValue("password", "", { shouldValidate: false });
        setValue("passwordConfirm", "", { shouldValidate: false });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>회원 정보 수정</h1>
      <main className={styles.container}>
        <form className={styles.form} noValidate onSubmit={handleSubmit(onSubmit)}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>프로필</h2>
            <div className={styles.field}>
              <div className={styles.avatarPicker} onClick={handleAvatarPick}>
                {previewUrl ? <img src={resolveImageUrl(previewUrl)} /> : <span className={styles.badge}>변경</span>}
                <input
                  type="file"
                  accept="image/*"
                  style={{ opacity: 0, position: "absolute", inset: 0, cursor: "pointer" }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
              <Button variant="tertiary" size="sm" type="button" onClick={handleImageRemove} disabled={isBusy}>
                이미지 삭제
              </Button>
              <ErrorMessage message={errors.profileImage} />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>이메일</label>
              <div className={styles.staticText}>{email || "이메일을 불러오고 있습니다..."}</div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>닉네임</label>
              <Input
                type="text"
                placeholder="닉네임을 입력하세요"
                disabled={isBusy}
                {...register("nickname", {
                  required: { message: "닉네임을 입력해주세요." },
                  validate: (v) => (!String(v || "").includes(" ") ? true : "띄어쓰기를 없애주세요."),
                  maxLength: { value: 10, message: "닉네임은 최대 10자까지 작성 가능합니다." },
                })}
              />
              <ErrorMessage message={errors.nickname} />
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>비밀번호 변경</h2>
            <div className={styles.field}>
              <label className={styles.label}>비밀번호</label>
              <Input
                type="password"
                placeholder="비밀번호를 입력하세요"
                disabled={isBusy}
                {...register("password", {
                  validate: (v) => {
                    if (!v) return true;
                    if (!PASSWORD_RULE.test(v)) {
                      return "비밀번호는 8~20자, 대문자/소문자/숫자/특수문자 각 1개 이상 포함해야 합니다.";
                    }
                    const confirm = getValues().passwordConfirm;
                    if (confirm && confirm !== v) return "비밀번호가 다릅니다.";
                    return true;
                  },
                })}
              />
              <ErrorMessage message={errors.password} />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>비밀번호 확인</label>
              <Input
                type="password"
                placeholder="비밀번호를 한 번 더 입력하세요"
                disabled={isBusy}
                {...register("passwordConfirm", {
                  validate: (v) => {
                    const pwd = getValues().password;
                    if (!v && !pwd) return true;
                    if (!pwd) return "비밀번호를 먼저 입력해주세요.";
                    if (v !== pwd) return "비밀번호가 다릅니다.";
                    return true;
                  },
                })}
              />
              <ErrorMessage message={errors.passwordConfirm} />
            </div>
          </section>

          <div className={styles.actions}>
            <Button variant="secondary" type="button" onClick={() => setDeleteOpen(true)} disabled={isBusy}>
              회원 탈퇴
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isBusy || updateUserMutation.isPending || updatePasswordMutation.isPending}
            >
              정보 수정
            </Button>
          </div>
        </form>
      </main>
      {isDeleteOpen && (
        <Modal
          title="회원 탈퇴 하시겠습니까?"
          message="삭제 후 복구할 수 없습니다."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteOpen(false)}
        />
      )}
    </div>
  );
}

export default ProfileEdit;
