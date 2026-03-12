/**
 * Generic interface for a use case that receieves and returns domain entities
 * 
 * @template I a domain entity or value object used as input
 * @template O a domain entity or result returned by the use case
 */
export interface IUseCase<I, O> {

    /**
     * Execute the Use Case action
     * @param input domain entity or value object
     * @returns a domain entity or a value
     */
    execute(input?: I): Promise<O>;

};