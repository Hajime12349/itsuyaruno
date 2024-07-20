import { Autocomplete, TextField, Chip } from "@mui/material";
import { Tag } from "@/lib/entity";

interface TagInputProps {
    defaultTags?: Tag[];
    onChange: (tags: Tag[]) => void;
    value?: Tag[];
    onBlur?: () => void;
    ref?: React.Ref<HTMLInputElement>;
    style?: React.CSSProperties;
}

export default function TagInput({ onChange, style, value, onBlur, ref }: TagInputProps) {
    const tagOptions: Tag[] = [{ tag_name: "tag1" }, { tag_name: "tag2" }, { tag_name: "tag3" }];

    return (
        <Autocomplete
            multiple
            options={tagOptions.map((tag) => tag.tag_name)}
            defaultValue={value?.map((tag) => tag.tag_name) ?? []}
            value={value?.map((tag) => tag.tag_name) ?? []}
            onChange={(e, newValue) => {
                onChange(newValue.map((tag) => ({ tag_name: tag })));
            }}
            onBlur={onBlur}
            freeSolo
            renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return (
                        <Chip variant="outlined" label={option} key={key} {...tagProps} />
                    );
                })
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder="タグを追加、Enterで新規作成"
                    label="タグ"
                    ref={ref}
                    style={style}
                />
            )}
        />
    )
}
