import React, { useMemo } from "react";
import { Autocomplete, Chip, CircularProgress, TextField } from "@mui/material";
import type { TagDTO as Tag } from "@/interfaces/http/tags/mappers";

interface TagInputProps {
    defaultTags?: Tag[];
    onChange: (tags: Tag[]) => void;
    value?: Tag[];
    onBlur?: () => void;
    ref?: React.Ref<HTMLInputElement>;
    style?: React.CSSProperties;
    options?: Tag[];
    loading?: boolean;
}

export default function TagInput({ onChange, style, value, onBlur, ref, options = [], loading = false }: TagInputProps) {
    const optionNames = useMemo(() => options.map(t => t.tag_name), [options])

    return (
        <Autocomplete
            multiple
            options={optionNames}
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
