/**
 * Generic CRUD DAO Interface
 * 
 * @template I Entity identifier (ID)
 * @template PO Persistence Object (PO)
 */
export interface IGenericDAO<I, PO> {

    /**
     * Get an entity by ID
     * @param id the entity ID
     * @returns the PO entity
     */
    findById(id: I): Promise<PO>;

    /**
     * Retrieve all PO entities
     * @returns a list of all PO entities
     */
    findAll(): Promise<PO[]>;

    /**
     * Create/update a new entity
     * @param entity the entity to be saved
     * @returns the saved PO entity
     */
    save(entity: PO): Promise<PO>;

    /**
     * Delete an entity
     * @param entity the entity to be deleted
     * @returns true id the entity was deleted, false otherwise
     */
    delete(entity: PO): Promise<boolean>;

};