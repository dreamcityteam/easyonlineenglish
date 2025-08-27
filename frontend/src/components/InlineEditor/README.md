# InlineEditor Component

Un componente React para edición inline de texto con funcionalidad de guardar/cancelar.

## Características

- **Edición inline**: Haz clic en el texto para editarlo
- **Guardar automático**: Presiona Enter o haz clic fuera del campo para guardar
- **Cancelar**: Presiona Escape o haz clic en el botón X para cancelar
- **Indicador visual**: Muestra un ícono de edición al hacer hover
- **Estado de carga**: Muestra indicador mientras se guarda
- **Manejo de errores**: Revierte cambios si hay error al guardar

## Uso

```tsx
import InlineEditor from '../../../components/InlineEditor';

<InlineEditor
  value="Texto actual"
  onSave={async (newValue) => {
    // Lógica para guardar el nuevo valor
    await updateData(newValue);
  }}
  placeholder="Texto placeholder..."
  className="mi-clase-css"
  disabled={false}
/>
```

## Props

- `value` (string): El valor actual del texto
- `onSave` (function): Función async que se ejecuta al guardar
- `placeholder` (string, opcional): Texto placeholder
- `className` (string, opcional): Clases CSS adicionales
- `isEditing` (boolean, opcional): Control externo del estado de edición
- `onEditingChange` (function, opcional): Callback cuando cambia el estado de edición
- `disabled` (boolean, opcional): Deshabilita la edición

## Integración en Course Component

El InlineEditor se integra automáticamente en el componente Course cuando el usuario es admin:

- **English Word**: Editable haciendo clic en la palabra en inglés
- **Spanish Translation**: Editable haciendo clic en la traducción en español

Los cambios se guardan automáticamente en la base de datos y se actualiza el estado local.

## API Backend

El componente utiliza el endpoint `update-sentence` para guardar cambios:

```
PUT /update-sentence
{
  "wordId": "string",
  "sentenceIndex": number,
  "englishWord": "string", // opcional
  "spanishTranslation": "string" // opcional
}
```
