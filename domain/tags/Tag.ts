export interface TagProps {
    name: string;
}

export class TagEntity {
    readonly name: string;

    private constructor(props: TagProps) {
        this.name = props.name;
    }

    static create(props: TagProps): TagEntity {
        if (!props.name) throw new Error('name is required');
        return new TagEntity(props);
    }
}


