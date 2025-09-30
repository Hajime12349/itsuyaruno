import { BadRequestError } from '@/lib/errors/AppError';
import { TaskTotalSet } from './valueObjects/TaskTotalSet';
import { TaskCurrentSet } from './valueObjects/TaskCurrentSet';

export function ensureCurrentSetWithinTotal(totalSet: TaskTotalSet, currentSet: TaskCurrentSet): void {
    if (currentSet.value > totalSet.value) {
        throw new BadRequestError('current_set must be less than or equal to total_set');
    }
}
