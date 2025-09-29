import { BadRequestError } from '@/shared/errors/AppError';
import { TagName } from './valueObjects/TagName';

export interface TagValueProps {
    name: TagName;
}

export class TagEntity {
    readonly name: TagName;

    private constructor(props: TagValueProps) {
        this.name = props.name;
    }

    static create(props: TagValueProps): TagEntity {
        if (!props || typeof props !== 'object') {
            throw new BadRequestError('TagEntity requires a props object');
        }
        if (!(props.name instanceof TagName)) {
            throw new BadRequestError('TagEntity name must be a TagName');
        }
        return new TagEntity({ name: props.name });
    }
}
