"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getSession } from "next-auth/react";
import { registerUser } from "@/lib/db_api_wrapper";
import styles from "./UserRegisterForm.module.css";

type FormValues = {
    display_name: string;
};

const UserRegisterForm = () => {
    const { register, handleSubmit, setValue } = useForm<FormValues>();

    useEffect(() => {
        const fetchUser = async () => {
            const session = await getSession();
            if (session && session.user) {
                setValue("display_name", session.user.name || "");
            }
        };

        fetchUser();
    }, [setValue]);

    const onSubmit = (data: FormValues) => {
        registerUser({
            display_name: data.display_name,
        }).then(() => {
            console.log("User registered successfully!");
            window.location.href = '/task-config-main-screen';
        });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.h1}>ユーザー新規登録</h1>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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