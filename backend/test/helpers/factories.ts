import { Workspace }           from '../../src/domain/model/Workspace.js';
import { TeamMember }          from '../../src/domain/model/TeamMember.js';
import { Project }             from '../../src/domain/model/Project.js';
import { Client }              from '../../src/domain/model/Client.js';
import { Company }             from '../../src/domain/model/Company.js';
import { TeamMemberRoles }     from '../../src/domain/enums/TeamMemberRoles.js';
import { TeamMemberStatuses }  from '../../src/domain/enums/TeamMemberStatuses.js';

// ----- Domain object factories -----

export function makeWorkspace(overrides: Partial<{ id: string; name: string; slug: string; createdAt: Date; updatedAt: Date }> = {}): Workspace {
    const ws = new Workspace();
    ws.id        = overrides.id        ?? 'ws-uuid-1';
    ws.name      = overrides.name      ?? 'Test Workspace';
    ws.slug      = overrides.slug      ?? 'test-workspace';
    ws.createdAt = overrides.createdAt ?? new Date('2024-01-01T00:00:00Z');
    ws.updatedAt = overrides.updatedAt ?? new Date('2024-01-01T00:00:00Z');
    return ws;
}

export function makeTeamMember(overrides: Partial<{
    id:        string;
    workspace: Workspace;
    userId:    string;
    email:     string | null;
    firstName: string | null;
    lastName:  string | null;
    role:      TeamMemberRoles;
    status:    TeamMemberStatuses;
    createdAt: Date;
    updatedAt: Date;
}> = {}): TeamMember {
    const tm = new TeamMember();
    tm.id        = overrides.id        ?? 'tm-uuid-1';
    tm.workspace = overrides.workspace ?? makeWorkspace();
    tm.userId    = overrides.userId    ?? 'user-uuid-1';
    tm.email     = overrides.email     ?? null;
    tm.firstName = overrides.firstName ?? null;
    tm.lastName  = overrides.lastName  ?? null;
    tm.role      = overrides.role      ?? TeamMemberRoles.MEMBER;
    tm.status    = overrides.status    ?? TeamMemberStatuses.ACTIVE;
    tm.createdAt = overrides.createdAt ?? new Date('2024-01-01T00:00:00Z');
    tm.updatedAt = overrides.updatedAt ?? new Date('2024-01-01T00:00:00Z');
    return tm;
}

export function makeMockClerkService() {
    return {
        createInvitation: jest.fn(),
        getUser: jest.fn().mockResolvedValue({ email: null, firstName: null, lastName: null }),
    };
}

export function makeProject(overrides: Partial<{ id: string; workspace: Workspace }> = {}): Project {
    const p = new Project();
    p.id        = overrides.id        ?? 'proj-uuid-1';
    p.workspace = overrides.workspace ?? makeWorkspace();
    return p;
}

export function makeCompany(overrides: Partial<{ id: string; name: string; workspace: Workspace }> = {}): Company {
    const c = new Company();
    c.id        = overrides.id        ?? 'company-uuid-1';
    c.name      = overrides.name      ?? 'Acme Corp';
    c.workspace = overrides.workspace ?? makeWorkspace();
    return c;
}

export function makeClient(overrides: Partial<{ id: string; workspace: Workspace }> = {}): Client {
    const c = new Client();
    c.id        = overrides.id        ?? 'client-uuid-1';
    c.workspace = overrides.workspace ?? makeWorkspace();
    return c;
}

// ----- Mock repository factories -----

export function makeMockWorkspaceRepository() {
    return {
        findBySlug:   jest.fn(),
        findByUserId: jest.fn(),
        findById:     jest.fn(),
        save:         jest.fn(),
        delete:       jest.fn(),
    };
}

export function makeMockTeamMemberRepository() {
    return {
        findByWorkspaceAndUser: jest.fn(),
        findByWorkspace:        jest.fn(),
        findById:               jest.fn(),
        save:                   jest.fn(),
        delete:                 jest.fn(),
    };
}

export function makeMockProjectRepository() {
    return {
        findByWorkspace: jest.fn(),
        findByClient:    jest.fn(),
        findById:        jest.fn(),
        save:            jest.fn(),
        delete:          jest.fn(),
    };
}

export function makeMockCompanyRepository() {
    return {
        findByWorkspace: jest.fn(),
        findById:        jest.fn(),
        save:            jest.fn(),
        delete:          jest.fn(),
    };
}

export function makeMockClientRepository() {
    return {
        findByWorkspace: jest.fn(),
        findByCompany:   jest.fn(),
        findById:        jest.fn(),
        save:            jest.fn(),
        delete:          jest.fn(),
    };
}
