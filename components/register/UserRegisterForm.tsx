"use client";

import React, { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { registerUser } from "@/lib/api_wrapper";
import styles from "./UserRegisterForm.module.css";

type FormValues = {
    display_name: string;
};

interface UserRegisterFormProps {
    defaultDisplayName?: string;
    onSubmit?: (data: FormValues) => Promise<void> | void;
}

const UserRegisterForm = ({ defaultDisplayName = "", onSubmit }: UserRegisterFormProps) => {
    const { register, handleSubmit, setValue } = useForm<FormValues>();

    useEffect(() => {
        setValue("display_name", defaultDisplayName);
    }, [defaultDisplayName, setValue]);

    const handleSubmitInternal: SubmitHandler<FormValues> = async (data) => {
        if (onSubmit) {
            await onSubmit(data);
            return;
        }

        await registerUser({
            display_name: data.display_name,
        });

        console.log("User registered successfully!");
        window.location.href = "/task-config-main-screen";
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.h1}>ユーザー新規登録</h1>
            <form onSubmit={handleSubmit(handleSubmitInternal)} className={styles.form}>
                <div>
                    <label htmlFor="display_name" className={styles.label}>表示名</label>
                    <input
                        id="display_name"
                        type="text"
                        {...register("display_name", { required: true })}
                        className={styles.input}
                    />
                </div>
                <button type="submit" className={styles.button}>はじめる</button>
            </form>
        </div>
    );
};

export default UserRegisterForm;