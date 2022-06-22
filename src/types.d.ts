export type GameObjectInfo = {
    name: string,
    children?: GameObjectInfo[]
    uuid: number
}

export type GameObjectComponentProperty = {
    name: string,
    value: any
    /**
     * 数据类型
     */
    type: 'boolean' | 'string' | 'number'
    /**
     * 编辑器类型
     */
    editorType: 'select' | 'textfield' | 'checkbox'

    options?: { value: (number | string | boolean), label: string }[]
}

export type GameObjectComponents = { name: string, properties: GameObjectComponentProperty[] }[]