import { Autocomplete, TextField, Chip } from "@mui/material";
import { Task, Tag } from "@/lib/entity";
import { Controller, useFormContext } from "react-hook-form";

const TagInput = () => {
    const { control } = useFormContext();
    const tagOptions: Tag[] = [{ tag_name: "tag1" }, { tag_name: "tag2" }, { tag_name: "tag3" }];

    return (
        <Controller
            name="tags"
            control={control}
            render={({ field, formState: { errors } }) => (
                <Autocomplete
                    multiple
                    id="tags-filled"
                    options={tagOptions.map((tag) => tag.tag_name)}
                    defaultValue={[]}
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
                            variant="filled"
                            placeholder="タグを追加"
                            label="タグ"
                            inputRef={field.ref}
                            value={field.value}
                            onBlur={field.onBlur}
                            onChange={field.onChange}
                        />
                    )}
                />
            )}
        />
    )
}
