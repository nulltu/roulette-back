import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseCreatePlayerDto } from './dto/reponse-create-player.dto';

@ApiTags('Players')
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Player created successfully',
    type: ResponseCreatePlayerDto,
  })
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playersService.create(createPlayerDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of players retrieved successfully',
    type: [ResponseCreatePlayerDto],
  })
  findAll() {
    return this.playersService.findAll();
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Player deleted successfully',
  })
  deletePlayerById(@Param('id') id: string) {
    return this.playersService.deletePlayerById(+id);
  }
}
