
import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User'
import { Departementstaff } from 'src/entities/Departementstaff';
import { Departementpermissionrole } from 'src/entities/Departementpermissionrole';
import { Departementpermission } from 'src/entities/Departementpermission';


@Injectable()
export class PermissionsService {


    constructor(
        @InjectRepository(Departementstaff)
        private StaffRepo: Repository<Departementstaff>,
        @InjectRepository(Departementpermissionrole)
        private PermissionroleRepo: Repository<Departementpermissionrole>,
        @InjectRepository(Departementpermission)
        private PermissionRepo: Repository<Departementpermission>,
    ) { }


    async isAdmin(userID: number): Promise<boolean> {
        const user = await this.StaffRepo.findOne({ where: { userId: userID, roleId: 1 } });
        console.log(user == null);
        
        return user != null;
    }

    async getPerms(userID: number): Promise<Departementpermissionrole[]> {
      
        const roles = (await this.StaffRepo.find({ where: { userId: userID } }));
        const roleIds = [];
        roles.forEach(element => {
            roleIds.push(element.roleId);
        });
        return this.PermissionroleRepo.find({ where: { roleId: In(roleIds) } });
    }

    async getPermsByDept(userID: number, deptID: number): Promise<Departementpermissionrole[]> {
        const roles = (await this.StaffRepo.findOne({ where: { userId: userID, departementId: deptID } }));
        return (await this.PermissionroleRepo.find({ where: { roleId: roles, departementId: deptID }, relations: ["permission"] }));
    }

}
