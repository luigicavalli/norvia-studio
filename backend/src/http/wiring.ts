import { ClientController }            from "../interface/controller/ClientController.js";
import { getPoolInstance }             from "../infrastructure/persistence/dao/pg/PgConnectionPool.js";
import { ProjectController }           from "../interface/controller/ProjectController.js";
import { CompanyController }           from "../interface/controller/CompanyController.js";
import { CreateClientUseCase }         from "../application/use-case/CreateClientUseCase.js";
import { UpdateClientUseCase }         from "../application/use-case/UpdateClientUseCase.js";
import { DeleteClientUseCase }         from "../application/use-case/DeleteClientUseCase.js";
import { WorkspaceController }         from "../interface/controller/WorkspaceController.js";
import { PgQuoteDAOImpl }              from "../infrastructure/persistence/dao/pg/PgQuoteDAOImpl.js";
import { ClientRepositoryImpl }        from "../infrastructure/persistence/repository/ClientRepositoryImpl.js";
import { CreateCompanyUseCase }        from "../application/use-case/CreateCompanyUseCase.js";
import { CreateProjectUseCase }        from "../application/use-case/CreateProjectUseCase.js";
import { UpdateProjectUseCase }        from "../application/use-case/UpdateProjectUseCase.js";
import { DeleteProjectUseCase }        from "../application/use-case/DeleteProjectUseCase.js";
import { UpdateCompanyUseCase }        from "../application/use-case/UpdateCompanyUseCase.js";
import { DeleteCompanyUseCase }        from "../application/use-case/DeleteCompanyUseCase.js";
import { GetAllClientsUseCase }        from "../application/use-case/GetAllClientsUseCase.js";
import { GetClientByIdUseCase }        from "../application/use-case/GetClientByIdUseCase.js";
import { TeamMemberController }        from "../interface/controller/TeamMemberController.js";
import { AddTeamMemberUseCase }        from "../application/use-case/AddTeamMemberUseCase.js";
import { InviteTeamMemberUseCase }     from "../application/use-case/InviteTeamMemberUseCase.js";
import { ActivateTeamMemberUseCase }   from "../application/use-case/ActivateTeamMemberUseCase.js";
import { ClerkInvitationService }      from "../infrastructure/clerk/ClerkInvitationService.js";
import { PgClientDAOImpl }             from "../infrastructure/persistence/dao/pg/PgClientDAOImpl.js";
import { GetAllProjectsUseCase }       from "../application/use-case/GetAllProjectsUseCase.js";
import { GetProjectByIdUseCase }       from "../application/use-case/GetProjectByIdUseCase.js";
import { GetCompanyByIdUseCase }       from "../application/use-case/GetCompanyByIdUseCase.js";
import { ProjectRepositoryImpl }       from "../infrastructure/persistence/repository/ProjectRepositoryImpl.js";
import { CompanyRepositoryImpl }       from "../infrastructure/persistence/repository/CompanyRepositoryImpl.js";
import { PgProjectDAOImpl }            from "../infrastructure/persistence/dao/pg/PgProjectDAOImpl.js";
import { PgCompanyDAOImpl }            from "../infrastructure/persistence/dao/pg/PgCompanyDAOImpl.js";
import { GetAllCompaniesUseCase }      from "../application/use-case/GetAllCompaniesUseCase.js";
import { CreateWorkspaceUseCase }      from "../application/use-case/CreateWorkspaceUseCase.js";
import { UpdateWorkspaceUseCase }      from "../application/use-case/UpdateWorkspaceUseCase.js";
import { DeleteWorkspaceUseCase }      from "../application/use-case/DeleteWorkspaceUseCase.js";
import { WorkspaceRepositoryImpl }     from "../infrastructure/persistence/repository/WorkspaceRepositoryImpl.js";
import { GetAllWorkspacesUseCase }     from "../application/use-case/GetAllWorkspacesUseCase.js";
import { GetWorkspaceByIdUseCase }     from "../application/use-case/GetWorkspaceByIdUseCase.js";
import { RemoveTeamMemberUseCase }     from "../application/use-case/RemoveTeamMemberUseCase.js";
import { PgWorkspaceDAOImpl }          from "../infrastructure/persistence/dao/pg/PgWorkspaceDAOImpl.js";
import { TeamMemberRepositoryImpl }    from "../infrastructure/persistence/repository/TeamMemberRepositoryImpl.js";
import { GetWorkspaceBySlugUseCase }   from "../application/use-case/GetWorkspaceBySlugUseCase.js";
import { PgAssignmentDAOImpl }         from "../infrastructure/persistence/dao/pg/PgAssignmentDAOImpl.js";
import { PgTeamMemberDAOImpl }         from "../infrastructure/persistence/dao/pg/PgTeamMemberDAOImpl.js";
import { GetProjectsByClientUseCase }  from "../application/use-case/GetProjectsByClientUseCase.js";
import { UpdateProjectStatusUseCase }  from "../application/use-case/UpdateProjectStatusUseCase.js";
import { GetClientsByCompanyUseCase }  from "../application/use-case/GetClientsByCompanyUseCase.js";
import { GetWorkspaceMembersUseCase }  from "../application/use-case/GetWorkspaceMembersUseCase.js";
import { UpdateTeamMemberRoleUseCase }     from "../application/use-case/UpdateTeamMemberRoleUseCase.js";
import { AssignmentController }            from "../interface/controller/AssignmentController.js";
import { AssignmentRepositoryImpl }        from "../infrastructure/persistence/repository/AssignmentRepositoryImpl.js";
import { CreateAssignmentUseCase }         from "../application/use-case/CreateAssignmentUseCase.js";
import { DeleteAssignmentUseCase }         from "../application/use-case/DeleteAssignmentUseCase.js";
import { GetAssignmentsByProjectUseCase }   from "../application/use-case/GetAssignmentsByProjectUseCase.js";
import { GetAssignmentsByWorkspaceUseCase } from "../application/use-case/GetAssignmentsByWorkspaceUseCase.js";

// =========================================================================
//                          COMPLETE BOOTSTRAP
// =========================================================================

// =========================================================================
//                           PERSISTENCE LAYER
// =========================================================================

const pool                  = getPoolInstance();

const projectDAO            = new PgProjectDAOImpl(pool);
const companyDAO            = new PgCompanyDAOImpl(pool);
const clientDAO             = new PgClientDAOImpl(pool);
const workspaceDAO          = new PgWorkspaceDAOImpl(pool);
const assignmentDAO         = new PgAssignmentDAOImpl(pool);
const teamMemberDAO         = new PgTeamMemberDAOImpl(pool);
const quoteDAO              = new PgQuoteDAOImpl(pool);

const projectRepo           = new ProjectRepositoryImpl(projectDAO, workspaceDAO, assignmentDAO, teamMemberDAO, clientDAO, quoteDAO);
const companyRepo           = new CompanyRepositoryImpl(companyDAO, workspaceDAO);
const clientRepo            = new ClientRepositoryImpl(clientDAO);
const workspaceRepo         = new WorkspaceRepositoryImpl(workspaceDAO);
const teamMemberRepo        = new TeamMemberRepositoryImpl(teamMemberDAO);
const assignmentRepo        = new AssignmentRepositoryImpl(assignmentDAO, teamMemberDAO);

// =========================================================================
//                           APPLICATION LAYER
// =========================================================================

const clerkInvitationService = new ClerkInvitationService();

const getAllProjectsUC      = new GetAllProjectsUseCase(projectRepo, teamMemberRepo);
const getProjectsByClientUC = new GetProjectsByClientUseCase(projectRepo, teamMemberRepo);
const getProjectByIdUC      = new GetProjectByIdUseCase(projectRepo);
const createProjectUC       = new CreateProjectUseCase(projectRepo);
const updateProjectUC       = new UpdateProjectUseCase(projectRepo);
const updateProjectStatusUC = new UpdateProjectStatusUseCase(projectRepo);
const deleteProjectUC       = new DeleteProjectUseCase(projectRepo);

const getAllCompaniesUC     = new GetAllCompaniesUseCase(companyRepo, teamMemberRepo);
const getCompanyByIdUC      = new GetCompanyByIdUseCase(companyRepo);
const createCompanyUC       = new CreateCompanyUseCase(companyRepo);
const updateCompanyUC       = new UpdateCompanyUseCase(companyRepo);
const deleteCompanyUC       = new DeleteCompanyUseCase(companyRepo);

const getAllWorkspacesUC    = new GetAllWorkspacesUseCase(workspaceRepo);
const getWorkspaceByIdUC    = new GetWorkspaceByIdUseCase(workspaceRepo);
const getWorkspaceBySlugUC  = new GetWorkspaceBySlugUseCase(workspaceRepo);
const createWorkspaceUC     = new CreateWorkspaceUseCase(workspaceRepo, teamMemberRepo, clerkInvitationService);
const updateWorkspaceUC     = new UpdateWorkspaceUseCase(workspaceRepo, teamMemberRepo);
const deleteWorkspaceUC     = new DeleteWorkspaceUseCase(workspaceRepo, teamMemberRepo);

const getAllClientsUC       = new GetAllClientsUseCase(clientRepo, teamMemberRepo);
const getClientsByCompanyUC = new GetClientsByCompanyUseCase(clientRepo, teamMemberRepo);
const getClientByIdUC       = new GetClientByIdUseCase(clientRepo);
const createClientUC        = new CreateClientUseCase(clientRepo);
const updateClientUC        = new UpdateClientUseCase(clientRepo);
const deleteClientUC        = new DeleteClientUseCase(clientRepo);

// =========================================================================
//                           INTERFACE LAYER
// =========================================================================

const getWorkspaceMembersUC  = new GetWorkspaceMembersUseCase(teamMemberRepo);
const addTeamMemberUC        = new AddTeamMemberUseCase(teamMemberRepo, clerkInvitationService);
const inviteTeamMemberUC     = new InviteTeamMemberUseCase(teamMemberRepo, clerkInvitationService);
const activateTeamMemberUC   = new ActivateTeamMemberUseCase(teamMemberRepo);
const updateTeamMemberRoleUC = new UpdateTeamMemberRoleUseCase(teamMemberRepo);
const removeTeamMemberUC     = new RemoveTeamMemberUseCase(teamMemberRepo);

const workspaceCtrl         = new WorkspaceController(getAllWorkspacesUC, getWorkspaceByIdUC, getWorkspaceBySlugUC, createWorkspaceUC, updateWorkspaceUC, deleteWorkspaceUC);
const projectCtrl           = new ProjectController(getAllProjectsUC, getProjectsByClientUC, getProjectByIdUC, createProjectUC, updateProjectUC, updateProjectStatusUC, deleteProjectUC);
const companyCtrl           = new CompanyController(getAllCompaniesUC, getCompanyByIdUC, createCompanyUC, updateCompanyUC, deleteCompanyUC);
const clientCtrl            = new ClientController(getAllClientsUC, getClientsByCompanyUC, getClientByIdUC, createClientUC, updateClientUC, deleteClientUC);

const teamMemberCtrl        = new TeamMemberController(getWorkspaceMembersUC, addTeamMemberUC, inviteTeamMemberUC, updateTeamMemberRoleUC, removeTeamMemberUC);

const getAssignmentsByWorkspaceUC = new GetAssignmentsByWorkspaceUseCase(assignmentRepo, teamMemberRepo);
const getAssignmentsByProjectUC   = new GetAssignmentsByProjectUseCase(assignmentRepo, teamMemberRepo);
const createAssignmentUC          = new CreateAssignmentUseCase(assignmentRepo, teamMemberRepo);
const deleteAssignmentUC          = new DeleteAssignmentUseCase(assignmentRepo);

const assignmentCtrl = new AssignmentController(getAssignmentsByWorkspaceUC, getAssignmentsByProjectUC, createAssignmentUC, deleteAssignmentUC);

export const wiring = {
    workspaceCtrl,
    projectCtrl,
    companyCtrl,
    clientCtrl,
    teamMemberCtrl,
    assignmentCtrl,
    activateTeamMemberUC,
    clerkInvitationService,
};
