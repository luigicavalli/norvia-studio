import { wiring }                from "./wiring.js";
import { AppResponse }           from "../application/response/AppResponse.js";
import type { ClientDTO }        from "../interface/dto/ClientDTO.js";
import type { ProjectDTO }       from "../interface/dto/ProjectDTO.js";
import type { CompanyDTO }       from "../interface/dto/CompanyDTO.js";
import type { WorkspaceDTO }     from "../interface/dto/WorkspaceDTO.js";
import type { TeamMemberDTO }    from "../interface/dto/TeamMemberDTO.js";
import { TeamMemberRoles }       from "../domain/enums/TeamMemberRoles.js";
import { getAuth }               from "@clerk/express";

import { Router, type NextFunction, type Request, type Response } from "express";


export const createApiRouter = (deps = wiring) => {

    const { workspaceCtrl, projectCtrl, companyCtrl, clientCtrl, teamMemberCtrl } = deps;

    const router = Router();

    // -------------------------------------------------------------------------
    // Workspaces
    // -------------------------------------------------------------------------

    // Get all workspaces
    router.get('/workspaces', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = getAuth(req);

            const workspaces: WorkspaceDTO[] = await workspaceCtrl.getAll(userId!);

            AppResponse.ok(res, workspaces);
        } catch (error) {
            next(error);
        }
    });

    // Get a workspace by its slug  — must be before /:id to avoid route conflict
    router.get('/workspaces/slug/:slug', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const slug = req.params["slug"] as string;

            const workspace: WorkspaceDTO = await workspaceCtrl.getBySlug(slug);

            AppResponse.ok(res, workspace);
        } catch (error) {
            next(error);
        }
    });

    // Get a workspace by its ID
    router.get('/workspaces/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params["id"] as string;

            const workspace: WorkspaceDTO = await workspaceCtrl.getById(id);

            AppResponse.ok(res, workspace);
        } catch (error) {
            next(error);
        }
    });

    // Create a new Workspace
    router.post('/workspaces', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = getAuth(req);
            const body: WorkspaceDTO = req.body as WorkspaceDTO;

            await workspaceCtrl.save(body, userId!);

            AppResponse.created(res, null, 'Workspace created');
        } catch (error) {
            next(error);
        }
    });

    // Update an existing Workspace
    router.put('/workspaces/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = getAuth(req);
            const body: WorkspaceDTO = req.body as WorkspaceDTO;

            await workspaceCtrl.update(body, userId!);

            AppResponse.ok(res, null, 'Workspace edited');
        } catch (error) {
            next(error);
        }
    });

    // Delete an existing Workspace
    router.delete('/workspaces/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = getAuth(req);
            const id = req.params["id"] as string;

            await workspaceCtrl.delete(id, userId!);

            AppResponse.noContent(res);
        } catch (error) {
            next(error);
        }
    });

    // -------------------------------------------------------------------------
    // Team Members
    // -------------------------------------------------------------------------

    // Get all members of a workspace
    router.get('/workspaces/:id/members', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = getAuth(req);
            const workspaceId = req.params["id"] as string;

            const members: TeamMemberDTO[] = await teamMemberCtrl.getByWorkspace(workspaceId, userId!);

            AppResponse.ok(res, members);
        } catch (error) {
            next(error);
        }
    });

    // Invite a member to a workspace by email
    router.post('/workspaces/:id/members/invite', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = getAuth(req);
            const workspaceId = req.params["id"] as string;
            const { email, role } = req.body as { email: string; role: TeamMemberRoles };

            const member: TeamMemberDTO = await teamMemberCtrl.invite(workspaceId, email, role, userId!);

            AppResponse.created(res, member, 'Invite sent');
        } catch (error) {
            next(error);
        }
    });

    // Add a member to a workspace
    router.post('/workspaces/:id/members', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = getAuth(req);
            const workspaceId = req.params["id"] as string;
            const { newUserId, role } = req.body as { newUserId: string; role: TeamMemberRoles };

            const member: TeamMemberDTO = await teamMemberCtrl.add(workspaceId, newUserId, role, userId!);

            AppResponse.created(res, member, 'Member added');
        } catch (error) {
            next(error);
        }
    });

    // Update a member's role
    router.put('/workspaces/:id/members/:memberId', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = getAuth(req);
            const workspaceId = req.params["id"] as string;
            const memberId    = req.params["memberId"] as string;
            const { role }    = req.body as { role: TeamMemberRoles };

            const member: TeamMemberDTO = await teamMemberCtrl.updateRole(memberId, workspaceId, role, userId!);

            AppResponse.ok(res, member, 'Role updated');
        } catch (error) {
            next(error);
        }
    });

    // Remove a member from a workspace
    router.delete('/workspaces/:id/members/:memberId', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = getAuth(req);
            const workspaceId = req.params["id"] as string;
            const memberId    = req.params["memberId"] as string;

            await teamMemberCtrl.remove(memberId, workspaceId, userId!);

            AppResponse.noContent(res);
        } catch (error) {
            next(error);
        }
    });

    // -------------------------------------------------------------------------
    // Projects
    // -------------------------------------------------------------------------

    // Get all projects  — GET /projects?workspaceId=xxx
    router.get('/projects', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = getAuth(req);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { workspaceId, limit, offset } = req.query as any;

            const projects: ProjectDTO[] = await projectCtrl.getAll(workspaceId, userId!, limit, offset);

            const hasMore: boolean = projects.length === limit;

            AppResponse.paginated(res, projects, hasMore);
        } catch (error) {
            next(error);
        }
    });

    // Get all projects belonging to a client  — GET /clients/:id/projects?workspaceId=xxx
    router.get('/clients/:id/projects', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = getAuth(req);
            const clientId = req.params["id"] as string;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { workspaceId, limit, offset } = req.query as any;

            const projects: ProjectDTO[] = await projectCtrl.getByClient(workspaceId, clientId, userId!, limit, offset);

            const hasMore: boolean = projects.length === limit;

            AppResponse.paginated(res, projects, hasMore);
        } catch (error) {
            next(error);
        }
    });

    // Get a project by its ID
    router.get('/projects/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params["id"] as string;

            const project: ProjectDTO | null = await projectCtrl.getById(id);

            AppResponse.ok(res, project);
        } catch (error) {
            next(error);
        }
    });

    // Create a new Project
    router.post('/projects', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body: ProjectDTO = req.body as ProjectDTO;

            await projectCtrl.save(body);

            AppResponse.created(res, null, 'Project created');
        } catch (error) {
            next(error);
        }
    });

    // Update an existing Project
    router.put('/projects/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body: ProjectDTO = req.body as ProjectDTO;

            await projectCtrl.update(body);

            AppResponse.ok(res, null, 'Project edited');
        } catch (error) {
            next(error);
        }
    });

    // Delete an existing Project
    router.delete('/projects/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params["id"] as string;

            await projectCtrl.delete(id);

            AppResponse.noContent(res);
        } catch (error) {
            next(error);
        }
    });

    // -------------------------------------------------------------------------
    // Companies
    // -------------------------------------------------------------------------

    // Get all companies  — GET /companies?workspaceId=xxx
    router.get('/companies', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = getAuth(req);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { workspaceId, limit, offset } = req.query as any;

            const companies: CompanyDTO[] = await companyCtrl.getAll(workspaceId, userId!, limit, offset);

            const hasMore: boolean = companies.length === limit;

            AppResponse.paginated(res, companies, hasMore);
        } catch (error) {
            next(error);
        }
    });

    // Get all clients belonging to a company  — GET /companies/:id/clients?workspaceId=xxx
    router.get('/companies/:id/clients', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = getAuth(req);
            const companyId = req.params["id"] as string;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { workspaceId, limit, offset } = req.query as any;

            const clients: ClientDTO[] = await clientCtrl.getByCompany(workspaceId, companyId, userId!, limit, offset);

            const hasMore: boolean = clients.length === limit;

            AppResponse.paginated(res, clients, hasMore);
        } catch (error) {
            next(error);
        }
    });

    // Get a Company by its ID
    router.get('/companies/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params["id"] as string;

            const company: CompanyDTO | null = await companyCtrl.getById(id);

            AppResponse.ok(res, company);
        } catch (error) {
            next(error);
        }
    });

    // Create a new Company
    router.post('/companies', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body: CompanyDTO = req.body as CompanyDTO;

            await companyCtrl.save(body);

            AppResponse.created(res, null, 'Company created');
        } catch (error) {
            next(error);
        }
    });

    // Update an existing Company
    router.put('/companies/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body: CompanyDTO = req.body as CompanyDTO;

            await companyCtrl.update(body);

            AppResponse.ok(res, null, 'Company edited');
        } catch (error) {
            next(error);
        }
    });

    // Delete an existing Company
    router.delete('/companies/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params["id"] as string;

            await companyCtrl.delete(id);

            AppResponse.noContent(res);
        } catch (error) {
            next(error);
        }
    });

    // -------------------------------------------------------------------------
    // Clients
    // -------------------------------------------------------------------------

    // Get all clients  — GET /clients?workspaceId=xxx
    router.get('/clients', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = getAuth(req);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { workspaceId, limit, offset } = req.query as any;

            const clients: ClientDTO[] = await clientCtrl.getAll(workspaceId, userId!, limit, offset);

            const hasMore: boolean = clients.length === limit;

            AppResponse.paginated(res, clients, hasMore);
        } catch (error) {
            next(error);
        }
    });

    // Get a client by its ID
    router.get('/clients/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params["id"] as string;

            const client: ClientDTO | null = await clientCtrl.getById(id);

            AppResponse.ok(res, client);
        } catch (error) {
            next(error);
        }
    });

    // Create a new Client
    router.post('/clients', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body: ClientDTO = req.body as ClientDTO;

            await clientCtrl.save(body);

            AppResponse.created(res, null, 'Client created');
        } catch (error) {
            next(error);
        }
    });

    // Update an existing Client
    router.put('/clients/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body: ClientDTO = req.body as ClientDTO;

            await clientCtrl.update(body);

            AppResponse.ok(res, null, 'Client edited');
        } catch (error) {
            next(error);
        }
    });

    // Delete an existing Client
    router.delete('/clients/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params["id"] as string;

            await clientCtrl.delete(id);

            AppResponse.noContent(res);
        } catch (error) {
            next(error);
        }
    });

    return router;

};
