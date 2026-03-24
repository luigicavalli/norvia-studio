import { wiring }                                                 from "./wiring.js";
import type { ClientDTO }                                         from "../interface/dto/ClientDTO.js";
import type { ProjectDTO }                                        from "../interface/dto/ProjectDTO.js";
import type { CompanyDTO }                                        from "../interface/dto/CompanyDTO.js";
import { Router, type NextFunction, type Request, type Response } from "express";


export const createApiRouter = (deps = wiring) => {

    const { projectCtrl, companyCtrl, clientCtrl } = deps;

    const router = Router();

    // Projects - Get all projects
    router.get('/projects', async (req: Request, res: Response, next: NextFunction) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { limit, offset } = req.query as any;

            const projects = await projectCtrl.getAll(limit, offset);

            res.status(200).json(projects);
        } catch (error) {
            next(error);
        }
    });

    // Projects - Get a project by its ID
    router.get('/projects/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { id } = req.params as any;

            const project = await projectCtrl.getById(id);

            res.status(200).json(project);
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

            const projects = await projectCtrl.getByClient(id, limit, offset);

            res.status(200).json(projects);
        } catch (error) {
            next(error);
        }
    });

    // Projects - Create a new Project
    router.post('/projects', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body as ProjectDTO;

            await projectCtrl.save(body)

            res.status(200).json({ message: 'Project created' });
        } catch (error) {
            next(error);
        }
    });

    // Projects - Update an existing Project
    router.put('/projects', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body as ProjectDTO;

            await projectCtrl.save(body);

            res.status(200).json({ message: 'Project edited' });
        } catch (error) {
            next(error);
        }
    });

    // Projects - Delete an existing Project
    router.put('/projects', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body as ProjectDTO;

            await projectCtrl.delete(body);

            res.status(200).json({ message: 'Project deleted' });
        } catch (error) {
            next(error);
        }
    });

    // Companies - Get all companies
    router.get('/companies', async (req: Request, res: Response, next: NextFunction) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { limit, offset } = req.query as any;

            const companies = await companyCtrl.getAll(limit, offset);

            res.status(200).json(companies);
        } catch (error) {
            next(error);
        }
    });

    // Companies - Get a Company by its ID
    router.get('/companies/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { id } = req.params as any;

            const company = await companyCtrl.getById(id);

            res.status(200).json(company);
        } catch (error) {
            next(error);
        }
    });

    // Companies - Create a new Company
    router.post('/companies', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body as CompanyDTO;

            await companyCtrl.save(body);

            res.status(200).json({ message: 'Company created' });
        } catch (error) {
            next(error);
        }
    });

    // Companies - Update an existing Company
    router.put('/companies', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body as CompanyDTO;

            await companyCtrl.save(body);

            res.status(200).json({ message: 'Company edited' });
        } catch (error) {
            next(error);
        }
    });

    // Companies - Delete an existing Company
    router.delete('/companies', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body as CompanyDTO;

            await companyCtrl.save(body);

            res.status(200).json({ message: 'Company deleted' });
        } catch (error) {
            next(error);
        }
    });

    // Clients - Get all clients
    router.get('/clients', async (req: Request, res: Response, next: NextFunction) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { limit, offset } = req.query as any;

            const clients = await clientCtrl.getAll(limit, offset);

            res.status(200).json(clients);
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

            const clients = await clientCtrl.getByCompany(id, limit, offset);

            res.status(200).json(clients);
        } catch (error) {
            next(error);
        }
    });

    // Clients - Get a client by its ID
    router.get('/clients/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { id } = req.params as any;

            const client = await clientCtrl.getById(id);

            res.status(200).json(client);
        } catch (error) {
            next(error);
        }
    });

    // Clients - Create a new Client
    router.post('/clients', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body as ClientDTO;

            await clientCtrl.save(body);

            res.status(200).json({ message: 'Client created' });
        } catch (error) {
            next(error);
        }
    });

    // Clients - Update an existing Client
    router.put('/clients', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body as ClientDTO;

            await clientCtrl.save(body);

            res.status(200).json({ message: 'Client edited' });
        } catch (error) {
            next(error);
        }
    });

    // Clients - Delete an existing Client
    router.delete('/clients', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body as ClientDTO;

            await clientCtrl.delete(body);

            res.status(200).json({ message: 'Client deleted' });
        } catch (error) {
            next(error);
        }
    });

    return router;

};