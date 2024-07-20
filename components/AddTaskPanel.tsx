import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Collapse from '@mui/material/Collapse';
import { useState } from 'react';
import { Task, Tag } from '@/lib/entity';
import { useForm, Controller } from 'react-hook-form';
import TagInput from './TagInput';

interface AddTaskPanelProps {
    onAddTask: (task: Task) => void;
}

interface TaskFormInputs {
    taskName: string;
    taskTag: Tag[];
    totalSet: number;
    currentSet: number;
    taskDeadline: string | null;
}

export default function AddTaskPanel({ onAddTask }: AddTaskPanelProps) {
    const [expanded, setExpanded] = useState(false);
    const { handleSubmit, control, reset } = useForm<TaskFormInputs>({
        defaultValues: {
            taskName: "",
            taskTag: [],
            totalSet: 0,
            currentSet: 0,
            taskDeadline: null,
        },
    });

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleCancel = () => {
        reset();
        setExpanded(false);
    };

    const onSubmit = (data: TaskFormInputs) => {
        const newTask: Task = {
            task_name: data.taskName,
            total_set: data.totalSet,
            current_set: data.currentSet,
            is_complete: false,
            deadline: data.taskDeadline ? new Date(data.taskDeadline).toISOString() : undefined,
            tags: data.taskTag,
        };
        onAddTask(newTask);
        handleCancel();
    };

    return (
        <Card>
            <Collapse in={!expanded}>
                <CardActions>
                    <Button onClick={handleExpandClick} fullWidth key="add-task-button">
                        +
                    </Button>
                </CardActions>
            </Collapse>
            <Collapse in={expanded}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent>
                        <Controller
                            name="taskName"
                            control={control}
                            defaultValue=""
                            rules={{ required: "タスク名を入力してください" }}
                            render={({ field, formState: { errors } }) => (
                                <TextField
                                    {...field}
                                    label="Task Name"
                                    fullWidth
                                    error={!!errors.taskName}
                                    helperText={errors.taskName?.message}
                                />
                            )}
                        />
                        <Controller
                            name="taskTag"
                            control={control}
                            defaultValue={[]}
                            render={({ field }) => (
                                <TagInput
                                    {...field}
                                    style={{ marginTop: '16px' }}
                                />
                            )}
                        />
                        <Controller
                            name="totalSet"
                            control={control}
                            defaultValue={0}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Total Sets"
                                    type="number"
                                    fullWidth
                                    style={{ marginTop: '16px' }}
                                />
                            )}
                        />
                        <Controller
                            name="currentSet"
                            control={control}
                            defaultValue={0}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Current Set"
                                    type="number"
                                    fullWidth
                                    style={{ marginTop: '16px' }}
                                />
                            )}
                        />
                        <Controller
                            name="taskDeadline"
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Deadline"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    style={{ marginTop: '16px' }}
                                />
                            )}
                        />
                    </CardContent>
                    <CardActions>
                        <Button
                            onClick={handleCancel}
                            color="secondary"
                            sx={{ width: '25%' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            color="primary"
                            fullWidth
                            sx={{
                                backgroundColor: '#3f51b5',
                                color: 'white',
                                width: '75%'
                            }}
                        >
                            Save
                        </Button>
                    </CardActions>
                </form>
            </Collapse>
        </Card>
    );
}