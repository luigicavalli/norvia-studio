/**
 * Converter that handles the transformation between a Persistence Object (PO) and a Business Object (BO).
 * 
 * @template PO Persistence Object (PO)
 * @template BO Business Object (Domain Object)
 */
export interface IPersistenceConverter<PO, BO> {

    /**
     * Converts a PO into a domain BO
     * @param po the Persistence Object
     * @returns the Business Object
     */
    toBO(po: PO): BO;

    /**
     * Converts a domain BO into a PO
     * @param bo the Business Object
     * @returns the Persistence Object
     */
    toPO(bo: BO): PO;

};