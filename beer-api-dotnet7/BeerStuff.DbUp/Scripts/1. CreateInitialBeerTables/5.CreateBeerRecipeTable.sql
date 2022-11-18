create table beer_net.beer_recipe
(
    beer_recipe_id    int unsigned auto_increment
        primary key,
    name              varchar(100)                       not null,
    target_gravity    decimal(10, 2)                     null,
    original_gravity  decimal(10, 2)                     null,
    final_gravity     decimal(10, 2)                     null,
    alcohol_by_volume decimal(10, 2)                     null,
    batch_size        decimal(10, 2)                     null,
    row_created       datetime default CURRENT_TIMESTAMP null,
    row_modified      datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP
);