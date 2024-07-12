import TaskColumn from "@/components/TaskColumn";
import styles from "@/components/TaskColumn.module.css";

export default function Home() {
    return (
        <main>
            <div className={styles.scrollContainer}>
                <TaskColumn />
                <TaskColumn />
                <TaskColumn />
                <TaskColumn />

            </div>
        </main>
    );
}