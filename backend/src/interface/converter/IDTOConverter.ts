/**
 * Converter that handles the transformation between a DTO and a Business Object (BO).
 * 
 * @template DTO Request or Response DTO
 * @template BO Business Object (Domain Object)
 */
export interface IDTOConverter<DTO, BO> {

    /**
     * Converts a DTO into a domain BO
     * @param dto the DTO
     * @returns the Business Object
     */
    toBO(dto: DTO): BO;

    /**
     * Converts a domain BO into a DTO
     * @param bo the Business Object
     * @returns the DTO
     */
    toDTO(bo: BO): DTO;

};