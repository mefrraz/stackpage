# Implementação da Edição de Blocos

## Goal
Permitir que o utilizador clique num bloco no editor para o selecionar e, em seguida, editar as suas propriedades (texto, imagens, etc.) numa barra lateral direita.

## Proposed Changes

### 1. Pacote `packages/blocks`
#### [MODIFY] `src/block-renderer.tsx`
- Adicionar prop opcional `wrapper?: (props: { block: Block; children: React.ReactNode }) => React.ReactNode` ao `BlockRenderer`.
- Isto permite ao Editor envolver cada bloco com lógica extra (clique, borda de seleção, drag handle) sem alterar os componentes dos blocos em si.

### 2. App `apps/web` (Dashboard)
#### [MODIFY] `app/dashboard/editor/[id]/page.tsx`
- **Estado:**
    - `selectedBlockId: string | null`
- **Renderização:**
    - Passar um `wrapper` para o `BlockRenderer` que:
        - Adiciona um `div` com `onClick={() => setSelectedBlockId(block.id)}`.
        - Adiciona uma borda azul se `block.id === selectedBlockId`.
- **Sidebar Direita (Nova):**
    - Se `selectedBlockId` for nulo -> Mostrar "Selecione um bloco".
    - Se selecionado -> Mostrar formulário com inputs para as `props` do bloco.
    - Ao alterar um input -> Chamar `updateBlock(id, newProps)`.

#### [NEW] `components/block-properties-panel.tsx` (Opcional, ou inline em page.tsx para começar)
- Componente que recebe `block` e `onChange`.
- Renderiza inputs baseados no `block.type`.
    - `hero`: Title, Subtitle, CTA Text, CTA Link, Background Image.

## Verification Plan

### Manual Verification
1. Abrir o Editor de um site.
2. Clicar num bloco existente.
   - [ ] Deve aparecer uma borda azul à volta do bloco.
   - [ ] A sidebar direita deve mostrar os campos do bloco.
3. Editar o "Título" na sidebar.
   - [ ] O texto no bloco principal deve atualizar em tempo real.
4. Clicar em "Salvar".
   - [ ] Recarregar a página e confirmar que as alterações persistem.
