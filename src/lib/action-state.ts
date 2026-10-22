/** Resultado de uma Server Action de formulário. */
export interface ActionState {
  /** Mensagem geral de erro, mostrada no topo do formulário. */
  error?: string;
  /** Mensagem de cada campo com problema (chave = name do campo). */
  fieldErrors?: Record<string, string>;
  /** Valores enviados, para o formulário não perder o que a pessoa digitou. */
  values?: Record<string, string>;
  /** Ação concluída sem redirecionar (ex.: comentário adicionado). */
  ok?: boolean;
  /** Dados devolvidos à tela (ex.: o link do cliente, mostrado uma única vez). */
  data?: Record<string, string>;
  /** Muda a cada resposta, para o formulário saber que há um resultado novo. */
  nonce?: number;
}
