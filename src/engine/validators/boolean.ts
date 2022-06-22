type BooleanOptions = {
    editorType: 'checkbox' | 'select',
    options?: { value: string, label: string }[]
}

export const boolean: (options?: BooleanOptions) => PropertyDecorator = (options: BooleanOptions) => (target: any, key: string) => {
    options = options || { editorType: 'checkbox' };
    target.__metadatas = target.__metadatas || [];
    target.__metadatas.push({
        editorType: options.editorType,
        key,
        type: 'boolean',
        options: options.options,
        validator: (value: any) => {
            return true;
        }
    });
}