import { getPoolInstance }            from "../infrastructure/persistence/dao/pg/PgConnectionPool.js";
import { PgClientDAOImpl }            from "../infrastructure/persistence/dao/pg/PgClientDAOImpl.js";
import { PgProjectDAOImpl }           from "../infrastructure/persistence/dao/pg/PgProjectDAOImpl.js";
import { PgCompanyDAOImpl }           from "../infrastructure/persistence/dao/pg/PgCompanyDAOImpl.js";
import { PgWorkspaceDAOImpl }         from "../infrastructure/persistence/dao/pg/PgWorkspaceDAOImpl.js";
import { PgAssignmentDAOImpl }        from "../infrastructure/persistence/dao/pg/PgAssignmentDAOImpl.js";
import { PgTeamMemberDAOImpl }        from "../infrastructure/persistence/dao/pg/PgTeamMemberDAOImpl.js";
import { PgQuoteDAOImpl }             from "../infrastructure/persistence/dao/pg/PgQuoteDAOImpl.js";
import { ClientController }           from "../interface/controller/ClientController.js";
import { ProjectController }          from "../interface/controller/ProjectController.js";
import { CompanyController }          from "../interface/controller/CompanyController.js";
import { CreateClientUseCase }        from "../application/use-case/CreateClientUseCase.js";
import { UpdateClientUseCase }        from "../application/use-case/UpdateClientUseCase.js";
import { DeleteClientUseCase }        from "../application/use-case/DeleteClientUseCase.js";
import { ClientRepositoryImpl }       from "../infrastructure/persistence/repository/ClientRepositoryImpl.js";
import { CreateCompanyUseCase }       from "../application/use-case/CreateCompanyUseCase.js";
import { CreateProjectUseCase }       from "../application/use-case/CreateProjectUseCase.js";
import { UpdateProjectUseCase }       from "../application/use-case/UpdateProjectUseCase.js";
import { DeleteProjectUseCase }       from "../application/use-case/DeleteProjectUseCase.js";
import { UpdateCompanyUseCase }       from "../application/use-case/UpdateCompanyUseCase.js";
import { DeleteCompanyUseCase }       from "../application/use-case/DeleteCompanyUseCase.js";
import { GetAllClientsUseCase }       from "../application/use-case/GetAllClientsUseCase.js";
import { GetClientByIdUseCase }       from "../application/use-case/GetClientByIdUseCase.js";
import { GetAllProjectsUseCase }      from "../application/use-case/GetAllProjectsUseCase.js";
import { GetProjectByIdUseCase }      from "../application/use-case/GetProjectByIdUseCase.js";
import { GetCompanyByIdUseCase }      from "../application/use-case/GetCompanyByIdUseCase.js";
import { ProjectRepositoryImpl }      from "../infrastructure/persistence/repository/ProjectRepositoryImpl.js";
import { CompanyRepositoryImpl }      from "../infrastructure/persistence/repository/CompanyRepositoryImpl.js";
import { WorkspaceRepositoryImpl }    from "../infrastructure/persistence/repository/WorkspaceRepositoryImpl.js";
import { GetAllCompaniesUseCase }     from "../application/use-case/GetAllCompaniesUseCase.js";
import { GetProjectsByClientUseCase } from "../application/use-case/GetProjectsByClientUseCase.js";
import { UpdateProjectStatusUseCase } from "../application/use-case/UpdateProjectStatusUseCase.js";
import { GetClientsByCompanyUseCase } from "../application/use-case/GetClientsByCompanyUseCase.js";
import { GetAllWorkspacesUseCase }    from "../application/use-case/GetAllWorkspacesUseCase.js";
import { GetWorkspaceByIdUseCase }    from "../application/use-case/GetWorkspaceByIdUseCase.js";
import { GetWorkspaceBySlugUseCase }  from "../application/use-case/GetWorkspaceBySlugUseCase.js";
import { CreateWorkspaceUseCase }     from "../application/use-case/CreateWorkspaceUseCase.js";
import { UpdateWorkspaceUseCase }     from "../application/use-case/UpdateWorkspaceUseCase.js";
import { DeleteWorkspaceUseCase }     from "../application/use-case/DeleteWorkspaceUseCase.js";
import { WorkspaceController }        from "../interface/controller/WorkspaceController.js";

// =========================================================================
//                          COMPLETE BOOTSTRAP
// =========================================================================

// =========================================================================
//                           PERSISTENCE LAYER
// =========================================================================

const pgPoolInstance        = getPoolInstance();

const projectDAO            = new PgProjectDAOImpl(pgPoolInstance);
const companyDAO            = new PgCompanyDAOImpl(pgPoolInstance);
const clientDAO             = new PgClientDAOImpl(pgPoolInstance);
const workspaceDAO          = new PgWorkspaceDAOImpl(pgPoolInstance);
const assignmentDAO         = new PgAssignmentDAOImpl(pgPoolInstance);
const teamMemberDAO         = new PgTeamMemberDAOImpl(pgPoolInstance);
const quoteDAO              = new PgQuoteDAOImpl(pgPoolInstance);

const projectRepo           = new ProjectRepositoryImpl(projectDAO, workspaceDAO, assignmentDAO, teamMemberDAO, clientDAO, quoteDAO);
const companyRepo           = new CompanyRepositoryImpl(companyDAO, workspaceDAO);
const clientRepo            = new ClientRepositoryImpl(clientDAO);
const workspaceRepo         = new WorkspaceRepositoryImpl(workspaceDAO);

// =========================================================================
//                           APPLICATION LAYER
// =========================================================================

const getAllProjectsUC      = new GetAllProjectsUseCase(projectRepo);
const getProjectsByClientUC = new GetProjectsByClientUseCase(projectRepo);
const getProjectByIdUC      = new GetProjectByIdUseCase(projectRepo);
const createProjectUC       = new CreateProjectUseCase(projectRepo);
const updateProjectUC       = new UpdateProjectUseCase(projectRepo);
const updateProjectStatusUC = new UpdateProjectStatusUseCase(projectRepo);
const deleteProjectUC       = new DeleteProjectUseCase(projectRepo);

const getAllCompaniesUC     = new GetAllCompaniesUseCase(companyRepo);
const getCompanyByIdUC      = new GetCompanyByIdUseCase(companyRepo);
const createCompanyUC       = new CreateCompanyUseCase(companyRepo);
const updateCompanyUC       = new UpdateCompanyUseCase(companyRepo);
const deleteCompanyUC       = new DeleteCompanyUseCase(companyRepo);

const getAllWorkspacesUC    = new GetAllWorkspacesUseCase(workspaceRepo);
const getWorkspaceByIdUC   = new GetWorkspaceByIdUseCase(workspaceRepo);
const getWorkspaceBySlugUC = new GetWorkspaceBySlugUseCase(workspaceRepo);
const createWorkspaceUC    = new CreateWorkspaceUseCase(workspaceRepo);
const updateWorkspaceUC    = new UpdateWorkspaceUseCase(workspaceRepo);
const deleteWorkspaceUC    = new DeleteWorkspaceUseCase(workspaceRepo);

const getAllClientsUC       = new GetAllClientsUseCase(clientRepo);
const getClientsByCompanyUC = new GetClientsByCompanyUseCase(clientRepo);
const getClientByIdUC       = new GetClientByIdUseCase(clientRepo);
const createClientUC        = new CreateClientUseCase(clientRepo);
const updateClientUC        = new UpdateClientUseCase(clientRepo);
const deleteClientUC        = new DeleteClientUseCase(clientRepo);

// =========================================================================
//                           INTERFACE LAYER
// =========================================================================

const workspaceCtrl         = new WorkspaceController(getAllWorkspacesUC, getWorkspaceByIdUC, getWorkspaceBySlugUC, createWorkspaceUC, updateWorkspaceUC, deleteWorkspaceUC);
const projectCtrl           = new ProjectController(getAllProjectsUC, getProjectsByClientUC, getProjectByIdUC, createProjectUC, updateProjectUC, updateProjectStatusUC, deleteProjectUC);
const companyCtrl           = new CompanyController(getAllCompaniesUC, getCompanyByIdUC, createCompanyUC, updateCompanyUC, deleteCompanyUC);
const clientCtrl            = new ClientController(getAllClientsUC, getClientsByCompanyUC, getClientByIdUC, createClientUC, updateClientUC, deleteClientUC);

export const wiring = {
    workspaceCtrl,
    projectCtrl,
    companyCtrl,
    clientCtrl
};
