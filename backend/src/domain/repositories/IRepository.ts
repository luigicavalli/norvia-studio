/**
 * Generic interface for basic CRUD operations
 * 
 * @template I Entity identifier (ID)
 * @template E Entity type
 */
export interface IRepository<I, E> {

    /**
     * Get an entity by ID
     * @param id the entity ID
     * @returns the entity if found, null otherwise
     */
    findById(id: I): Promise<E | null>;

    /**
     * Retrieve all entities
     * @returns a list of all entities
     */
    findAll(): Promise<E[]>;

    /**
     * Create/update a new entity
     * @param entity the entity to be saved
     */
    save(entity: E): Promise<E>;

    /**
     * Delete an entity
     * @param E the entity to be deleted
     */
    delete(entity: E): Promise<boolean>;

};