import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Param,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { REVIEW_NOT_FOUND } from './review.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { IdValidationPipe } from '../pipes/ad-validation.pipe';

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @UsePipes(new ValidationPipe())
    @HttpCode(201)
    @Post('create')
    async create(@Body() dto: CreateReviewDto) {
        return await this.reviewService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', IdValidationPipe) id: string) {
        const deletedDoc = await this.reviewService.delete(id);
        if (!deletedDoc) {
            throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
    }

    @Get('by-product/:productId')
    async getByProduct(@Param('productId', IdValidationPipe) productId: string) {
        return await this.reviewService.findByProductId(productId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('by-product/:productId')
    async deleteByProduct(@Param('productId', IdValidationPipe) productId: string) {
        this.reviewService.deleteByProductId(productId);
    }
}
