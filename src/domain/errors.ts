// Erros de negócio. A interface os transforma em mensagens para o usuário.
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/** O ator não tem permissão para a ação (RN-12). */
export class ForbiddenError extends DomainError {}

/** Entrada que viola uma regra de negócio. */
export class RuleError extends DomainError {}

/** Registro inexistente (ou que o ator não deve saber que existe). */
export class NotFoundError extends DomainError {}
