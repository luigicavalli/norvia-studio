import { wiring }          from "./wiring.js";
import { AppResponse }     from "../application/response/AppResponse.js";
import type { ClientDTO }  from "../interface/dto/ClientDTO.js";
import type { ProjectDTO } from "../interface/dto/ProjectDTO.js";
import type { CompanyDTO } from "../interface/dto/CompanyDTO.js";

import { Router, type NextFunction, type Request, type Response } from "express";


export const createApiRouter = (deps = wiring) => {

    const { projectCtrl, companyCtrl, clientCtrl } = deps;

    const router = Router();

    // Projects - Get all projects
    router.get('/projects', async (req: Request, res: Response, next: NextFunction) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { limit, offset } = req.query as any;

            const projects: ProjectDTO[] = await projectCtrl.getAll(limit, offset);

            const hasMore: boolean = projects.length === limit;

            AppResponse.paginated(res, projects, hasMore);
        } catch (error) {
            next(error);
        }
    });

    // Projects - Get a project by its ID
    router.get('/projects/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { id } = req.params as any;

            const project: ProjectDTO | null = await projectCtrl.getById(id);

            AppResponse.ok(res, project);
        } catch (error) {
            next(error);
        }
    });

    // Projects - Get all projects related to a Client ID
    router.get('/projects/client/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { id } = req.params as any;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { limit, offset } = req.query as any;

            const projects: ProjectDTO[] = await projectCtrl.getByClient(id, limit, offset);

            const hasMore: boolean = projects.length === limit;

            AppResponse.paginated(res, projects, hasMore);
        } catch (error) {
            next(error);
        }
    });

    // Projects - Create a new Project
    router.post('/projects', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body: ProjectDTO = req.body as ProjectDTO;

            await projectCtrl.save(body);

            AppResponse.created(res, null, 'Project created');
        } catch (error) {
            next(error);
        }
    });

    // Projects - Update an existing Project
    router.put('/projects', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body: ProjectDTO = req.body as ProjectDTO;

            await projectCtrl.save(body);

            AppResponse.created(res, null, 'Project edited');
        } catch (error) {
            next(error);
        }
    });

    // Projects - Delete an existing Project
    router.delete('/projects', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body: ProjectDTO = req.body as ProjectDTO;

            await projectCtrl.delete(body);

            AppResponse.noContent(res);
        } catch (error) {
            next(error);
        }
    });

    // Companies - Get all companies
    router.get('/companies', async (req: Request, res: Response, next: NextFunction) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { limit, offset } = req.query as any;

            const companies: CompanyDTO[] = await companyCtrl.getAll(limit, offset);

            const hasMore: boolean = companies.length === limit;

            AppResponse.paginated(res, companies, hasMore);
        } catch (error) {
            next(error);
        }
    });

    // Companies - Get a Company by its ID
    router.get('/companies/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { id } = req.params as any;

            const company: CompanyDTO | null = await companyCtrl.getById(id);

            AppResponse.ok(res, company);
        } catch (error) {
            next(error);
        }
    });

    // Companies - Create a new Company
    router.post('/companies', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body: CompanyDTO = req.body as CompanyDTO;

            await companyCtrl.save(body);

            AppResponse.created(res, null, 'Company created');
        } catch (error) {
            next(error);
        }
    });

    // Companies - Update an existing Company
    router.put('/companies', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body: CompanyDTO = req.body as CompanyDTO;

            await companyCtrl.save(body);

            AppResponse.ok(res, null, 'Company edited');
        } catch (error) {
            next(error);
        }
    });

    // Companies - Delete an existing Company
    router.delete('/companies', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body: CompanyDTO = req.body as CompanyDTO;

            await companyCtrl.delete(body);

            AppResponse.noContent(res);
        } catch (error) {
            next(error);
        }
    });

    // Clients - Get all clients
    router.get('/clients', async (req: Request, res: Response, next: NextFunction) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { limit, offset } = req.query as any;

            const clients: ClientDTO[] = await clientCtrl.getAll(limit, offset);

            const hasMore: boolean = clients.length === limit;

            AppResponse.paginated(res, clients, hasMore);
        } catch (error) {
            next(error);
        }
    });

    // Clients - Get all clients related to a Company
    router.get('/clients/company/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { id } = req.params as any;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { limit, offset } = req.query as any;

            const clients: ClientDTO[] = await clientCtrl.getByCompany(id, limit, offset);

            const hasMore: boolean = clients.length === limit;

            AppResponse.paginated(res, clients, hasMore);
        } catch (error) {
            next(error);
        }
    });

    // Clients - Get a client by its ID
    router.get('/clients/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { id } = req.params as any;

            const client: ClientDTO | null = await clientCtrl.getById(id);

            AppResponse.ok(res, client);
        } catch (error) {
            next(error);
        }
    });

    // Clients - Create a new Client
    router.post('/clients', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body: ClientDTO = req.body as ClientDTO;

            await clientCtrl.save(body);

            AppResponse.created(res, null, 'Client created');
        } catch (error) {
            next(error);
        }
    });

    // Clients - Update an existing Client
    router.put('/clients', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body: ClientDTO = req.body as ClientDTO;

            await clientCtrl.save(body);

            AppResponse.created(res, null, 'Client edited');
        } catch (error) {
            next(error);
        }
    });

    // Clients - Delete an existing Client
    router.delete('/clients', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body: ClientDTO = req.body as ClientDTO;

            await clientCtrl.delete(body);

            AppResponse.noContent(res);
        } catch (error) {
            next(error);
        }
    });

    return router;

};