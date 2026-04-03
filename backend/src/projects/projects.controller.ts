import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards, Req, UseInterceptors, UploadedFiles, Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAll(@Query('limit') limit?: number) {
    return this.projectsService.findAll(limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.projectsService.create(createProjectDto, files, req.user.userId);
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 10))
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.projectsService.update(id, updateProjectDto, files);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}