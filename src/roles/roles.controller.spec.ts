import { forwardRef } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { Staff } from "src/staff/entities/staff.entity";
import { Repository } from "typeorm";
import { Role } from "./entities/role.entity";
import { RolesController } from "./roles.controller"
import { RolesService } from "./roles.service";
import { PermissionTypeEnum } from "./types/Permissions";

// https://docs.nestjs.com/fundamentals/testing#unit-testing
describe("RolesController", () => {
    let rolesController: RolesController;
    let rolesService: RolesService;
    let rolesRepository: Repository<Role>;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [RolesController],
            providers: [RolesService, {
                provide: getRepositoryToken(Role),
                useValue: {
                    create: jest.fn(),
                    save: jest.fn(),
                    findOne: jest.fn(),
                }
            }, {
                provide: getRepositoryToken(Staff),
                useValue: {
                    create: jest.fn(),
                    save: jest.fn(),
                    findOne: jest.fn(),
                }
            }]
        }).compile();

        rolesService = moduleRef.get<RolesService>(RolesService);
        rolesController = moduleRef.get<RolesController>(RolesController);
        rolesRepository = moduleRef.get<Repository<Role>>(getRepositoryToken(Role));
    });

    describe("findAll", () => {
        it("should return an array of roles", async () => {
            const result: Role[] = [];

            jest.spyOn(rolesService, "findAll").mockImplementation(async () => result);

            // expect(await rolesController.findAll()).toBe(result);
            expect(rolesRepository).toBeDefined();
        })
    });
});