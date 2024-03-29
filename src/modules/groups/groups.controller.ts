import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseCreateGroupDto } from './dto/response-create-group.dto';
import { ResponseGroupDto } from './dto/response-group.dto';

@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Group created successfully',
    type: ResponseCreateGroupDto,
  })
  create(
    @Body() createGroupDto: CreateGroupDto,
  ): Promise<ResponseCreateGroupDto> {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of groups retrieved successfully',
    type: [ResponseCreateGroupDto],
  })
  findAll(): Promise<ResponseCreateGroupDto[]> {
    return this.groupsService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Group retrieved successfully',
    type: [ResponseGroupDto],
  })
  findGroupById(@Param('id') id: number) {
    return this.groupsService.findGroupById(+id);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Group deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Group not found' })
  deleteGroupById(@Param('id') id: number) {
    return this.groupsService.deleteGroupById(+id);
  }
}
