import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Collapse from '@mui/material/Collapse';
import { useState } from 'react';
import { Task } from '@/lib/entity';

interface AddTaskPanelProps {
    onAddTask: (task: Task) => void;
}

export default function AddTaskPanel({ onAddTask }: AddTaskPanelProps) {
    const [expanded, setExpanded] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [taskTag, setTaskTag] = useState('');
    const [totalSet, setTotalSet] = useState<number | string>('');
    const [currentSet, setCurrentSet] = useState<number | string>(0);
    const [taskDeadline, setTaskDeadline] = useState<string | null>(null);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleCancel = () => {
        setTaskName('');
        setTaskTag('');
        setTotalSet('');
        setCurrentSet(0);
        setTaskDeadline(null);
        setExpanded(false);
    };

    const handleSave = () => {
        const newTask: Task = {
            task_name: taskName,
            total_set: typeof totalSet === 'string' ? parseInt(totalSet, 10) : totalSet,
            current_set: typeof currentSet === 'string' ? parseInt(currentSet, 10) : currentSet,
            is_complete: false,
            deadline: taskDeadline ? new Date(taskDeadline).toISOString() : undefined,
            tags: taskTag ? [{ tag_name: taskTag }] : undefined,
        };
        onAddTask(newTask);
        handleCancel();
    };


    return (
        <Card>
            <Collapse in={expanded}>
                <CardContent>
                    <TextField
                        label="Task Name"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Tag"
                        value={taskTag}
                        onChange={(e) => setTaskTag(e.target.value)}
                        fullWidth
                        style={{ marginTop: '16px' }}
                    />
                    <TextField
                        label="Total Sets"
                        value={totalSet}
                        onChange={(e) => setTotalSet(e.target.value)}
                        type="number"
                        fullWidth
                        style={{ marginTop: '16px' }}
                    />
                    <TextField
                        label="Current Set"
                        value={currentSet}
                        onChange={(e) => setCurrentSet(e.target.value)}
                        type="number"
                        fullWidth
                        style={{ marginTop: '16px' }}
                    />
                    <TextField
                        label="Deadline"
                        value={taskDeadline}
                        onChange={(e) => setTaskDeadline(e.target.value)}
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        style={{ marginTop: '16px' }}
                    />
                </CardContent>
            </Collapse>
            <CardActions>
                <Collapse in={expanded} orientation="horizontal" style={{ width: '100%' }}>
                    <Button
                        onClick={handleCancel}
                        color="secondary"
                        fullWidth
                        style={{ marginTop: '8px' }}
                    >
                        Cancel
                    </Button>
                </Collapse>
                <Collapse in={expanded} orientation="horizontal" style={{ width: '100%' }}>
                    <Button
                        onClick={handleSave}
                        color="primary"
                        fullWidth
                        style={{
                            marginTop: '8px',
                            backgroundColor: '#3f51b5',
                            color: 'white'
                        }}
                    >
                        Save
                    </Button>
                </Collapse>
                <Collapse in={!expanded} orientation="horizontal" style={{ width: '100%' }}>
                    <Button onClick={handleExpandClick} fullWidth key="add-task-button">
                        +
                    </Button>
                </Collapse>
            </CardActions>
        </Card>
    );
}
