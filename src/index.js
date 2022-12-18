import puppeteer from "puppeteer";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import moment from "moment";

dotenv.config();

const baseUrl = "http://localhost:5173";

faker.locale = "pt_BR";

const selectMatricula = "#functionary_id";
const selectCentroCusto = "#cost_center_id";
const selectVeiculo = "#vehicle_id";
const selectAbastecimento = "#refuelling_status";
const menuSelect = ".css-26l3qy-menu";

function myRandom(min, max, multiple) {
  return Math.round((Math.random() * (max - min)) / multiple) * multiple + min;
}

const mrRobot = async () => {
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();

  await page.goto(baseUrl);

  await page.waitForSelector('input[name="identifier"]');

  await page.type('input[name="identifier"]', process.env.EMAIL);
  await page.type('input[name="password"]', process.env.PASSWORD);

  await page.click('button[type="submit"]');

  await page.waitForNavigation();

  await page.goto(baseUrl + "/home/menu/controllbord/cadastre");

  //cadastro
  async function cadasterControllBord() {
    await page.waitForSelector('input[name="date_register"]');

    await page.type(
      'input[name="date_register"]',
      moment(faker.date.past()).format("DD-MM-YYYY")
    );

    await page.click(selectMatricula);
    await page.click(menuSelect);

    await page.waitForSelector(selectCentroCusto);
    await page.click(selectCentroCusto);
    await page.click(menuSelect);

    await page.click(selectVeiculo);
    await page.click(menuSelect);

    await page.type(
      'input[name="initial_km"]',
      myRandom(2000, 3000, 1).toString()
    );
    await page.type(
      'input[name="final_km"]',
      myRandom(3001, 5000, 1).toString()
    );

    await page.type('input[name="origin"]', faker.address.state());
    await page.type('input[name="destination"]', faker.address.state());

    await page.click(selectAbastecimento);
    await page.click(menuSelect);

    await page.click('button[type="submit"]');

    await page.goto(baseUrl + "/home/menu/controllbord/cadastre");
  }

  for (let i = 0; i < 2; i++) {
    await cadasterControllBord();
  }

  await browser.close();
};

mrRobot();
