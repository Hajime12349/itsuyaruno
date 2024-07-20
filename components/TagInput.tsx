import { Autocomplete, TextField, Chip } from "@mui/material";
import { Tag } from "@/lib/entity";
import { useState, useEffect } from "react";
import { getTags } from "@/lib/db_api_wrapper";
import React from "react";
import { CircularProgress } from "@mui/material";

interface TagInputProps {
    defaultTags?: Tag[];
    onChange: (tags: Tag[]) => void;
    value?: Tag[];
    onBlur?: () => void;
    ref?: React.Ref<HTMLInputElement>;
    style?: React.CSSProperties;
}

export default function TagInput({ onChange, style, value, onBlur, ref }: TagInputProps) {
    const [tagOptions, setTagOptions] = useState<Tag[]>([]);
    const loading = tagOptions.length === 0;

    useEffect(() => {
        let active = true;

        if (!loading) {
            return;
        }

        getTags().then((tags) => {
            if (active) {
                setTagOptions(tags);
            }
        }).catch((error) => {
            console.error(error);
        });

        return () => {
            active = false;
        };
    }, [loading]);

    return (
        <Autocomplete
            multiple
            options={tagOptions.map((tag) => tag.tag_name)}
            loading={loading}
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
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress size={20} /> : null}
                                {params.InputProps?.endAdornment}
                            </React.Fragment>
                        )
                    }}
                />
            )}
        />
    )
}
