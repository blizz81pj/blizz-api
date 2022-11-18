create table beer_net.beer_recipe_yeast
(
    beer_recipe_yeast_id        int unsigned auto_increment
        primary key,
    beer_recipe_id              int unsigned                       not null,
    beer_yeast_id               int unsigned                       not null,
    starter_gallons             decimal(10, 2)                     null,
    starter_malt_extract_ounces decimal(10, 2)                     null,
    row_created                 datetime default CURRENT_TIMESTAMP null,
    row_modified                datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    FOREIGN KEY (beer_recipe_id) REFERENCES beer_recipe(beer_recipe_id),
    FOREIGN KEY (beer_yeast_id) REFERENCES beer_yeast(beer_yeast_id)
);